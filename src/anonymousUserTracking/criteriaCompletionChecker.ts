import {
  SHARED_PREFS_EVENT_TYPE,
  KEY_ITEMS,
  TRACK_PURCHASE,
  TRACK_UPDATE_CART,
  TRACK_EVENT,
  UPDATE_CART,
  UPDATE_USER,
  KEY_EVENT_NAME,
  UPDATECART_ITEM_PREFIX,
  PURCHASE_ITEM_PREFIX
} from '../constants';

interface SearchQuery {
  combinator: string;
  searchQueries: SearchQuery[] | Criteria[];
  dataType?: string;
  searchCombo?: SearchQuery;
  field?: string;
  comparatorType?: string;
  value?: string;
  fieldType?: string;
  minMatch?: number;
  maxMatch?: number;
}

interface Criteria {
  criteriaId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  searchQuery: SearchQuery;
}

class CriteriaCompletionChecker {
  private localStoredEventList: any[];

  constructor(localStoredEventList: string) {
    this.localStoredEventList = JSON.parse(localStoredEventList);
  }

  public getMatchedCriteria(criteriaData: string): string | null {
    let criteriaId: string | null = null;

    try {
      const json = JSON.parse(criteriaData);
      if (json.criterias) {
        criteriaId = this.findMatchedCriteria(json.criterias);
      }
    } catch (e) {
      this.handleJSONException(e);
    }

    return criteriaId;
  }

  private findMatchedCriteria(criteriaList: Criteria[]): string | null {
    const eventsToProcess = this.prepareEventsToProcess();

    // Use find to get the first matching criteria
    const matchingCriteria = criteriaList.find((criteria) => {
      if (criteria.searchQuery && criteria.criteriaId) {
        return this.evaluateTree(criteria.searchQuery, eventsToProcess);
      }
      return false;
    });

    // Return the criteriaId of the matching criteria or null if none found
    return matchingCriteria ? matchingCriteria.criteriaId : null;
  }

  private prepareEventsToProcess(): any[] {
    const eventsToProcess: any[] = this.getEventsWithCartItems();
    const nonPurchaseEvents: any[] = this.getNonCartEvents();

    nonPurchaseEvents.forEach((event) => {
      eventsToProcess.push(event);
    });

    return eventsToProcess;
  }

  private getEventsWithCartItems(): any[] {
    const processedEvents: any[] = [];

    this.localStoredEventList.forEach((localEventData) => {
      if (
        localEventData[SHARED_PREFS_EVENT_TYPE] &&
        localEventData[SHARED_PREFS_EVENT_TYPE] === TRACK_PURCHASE
      ) {
        const updatedItem: Record<any, any> = {};

        if (localEventData[KEY_ITEMS]) {
          let items = localEventData[KEY_ITEMS];
          items = items.map((item: any) => {
            const updatItem: any = {};
            Object.keys(item).forEach((key) => {
              updatItem[`${PURCHASE_ITEM_PREFIX}${key}`] = item[key];
            });
            return updatItem;
          });
          updatedItem[KEY_ITEMS] = items;
        }

        if (localEventData.dataFields) {
          Object.keys(localEventData.dataFields).forEach((key) => {
            updatedItem[key] = localEventData.dataFields[key];
          });
        }

        Object.keys(localEventData).forEach((key) => {
          if (key !== KEY_ITEMS && key !== 'dataFields') {
            updatedItem[key] = localEventData[key];
          }
        });
        processedEvents.push({
          ...updatedItem,
          [SHARED_PREFS_EVENT_TYPE]: TRACK_PURCHASE
        });
      } else if (
        localEventData[SHARED_PREFS_EVENT_TYPE] &&
        localEventData[SHARED_PREFS_EVENT_TYPE] === TRACK_UPDATE_CART
      ) {
        const updatedItem: any = {};

        if (localEventData[KEY_ITEMS]) {
          let items = localEventData[KEY_ITEMS];
          items = items.map((item: any) => {
            const updatItem: any = {};
            Object.keys(item).forEach((key) => {
              updatItem[`${UPDATECART_ITEM_PREFIX}${key}`] = item[key];
            });
            return updatItem;
          });
          updatedItem[KEY_ITEMS] = items;
        }

        if (localEventData.dataFields) {
          Object.keys(localEventData.dataFields).forEach((key) => {
            updatedItem[key] = localEventData.dataFields[key];
          });
          delete localEventData.dataFields;
        }
        Object.keys(localEventData).forEach((key) => {
          if (key !== KEY_ITEMS && key !== 'dataFields') {
            if (key === SHARED_PREFS_EVENT_TYPE) {
              updatedItem[key] = TRACK_EVENT;
            } else {
              updatedItem[key] = localEventData[key];
            }
          }
        });
        processedEvents.push({
          ...updatedItem,
          [KEY_EVENT_NAME]: UPDATE_CART,
          [SHARED_PREFS_EVENT_TYPE]: TRACK_EVENT
        });
      }
    });
    return processedEvents;
  }

  private getNonCartEvents(): any[] {
    const nonPurchaseEvents: any[] = [];
    this.localStoredEventList.forEach((localEventData) => {
      if (
        localEventData[SHARED_PREFS_EVENT_TYPE] &&
        (localEventData[SHARED_PREFS_EVENT_TYPE] === UPDATE_USER ||
          localEventData[SHARED_PREFS_EVENT_TYPE] === TRACK_EVENT)
      ) {
        const updatedItem: any = localEventData;
        if (localEventData.dataFields) {
          Object.keys(localEventData.dataFields).forEach((key) => {
            updatedItem[key] = localEventData.dataFields[key];
          });
          delete localEventData.dataFields;
        }
        nonPurchaseEvents.push(updatedItem);
      }
    });
    return nonPurchaseEvents;
  }

  private evaluateTree(node: SearchQuery, localEventData: any[]): boolean {
    try {
      if (node.searchQueries) {
        const combinator = node.combinator;
        const searchQueries: any = node.searchQueries;
        if (combinator === 'And') {
          for (let i = 0; i < searchQueries.length; i++) {
            if (!this.evaluateTree(searchQueries[i], localEventData)) {
              return false;
            }
          }
          return true;
        } else if (combinator === 'Or') {
          for (let i = 0; i < searchQueries.length; i++) {
            if (this.evaluateTree(searchQueries[i], localEventData)) {
              return true;
            }
          }
          return false;
        } else if (combinator === 'Not') {
          for (let i = 0; i < searchQueries.length; i++) {
            searchQueries[i]['isNot'] = true;
            if (this.evaluateTree(searchQueries[i], localEventData)) {
              return false;
            }
          }
          return true;
        }
      } else if (node.searchCombo) {
        return this.evaluateSearchQueries(node, localEventData);
      }
    } catch (e) {
      this.handleException(e);
    }
    return false;
  }

  private evaluateSearchQueries(
    node: SearchQuery,
    localEventData: any[]
  ): boolean {
    // this function will compare the actualy searhqueues under search combo
    for (let i = 0; i < localEventData.length; i++) {
      const eventData = localEventData[i];
      const trackingType = eventData[SHARED_PREFS_EVENT_TYPE];
      const dataType = node.dataType;
      if (dataType === trackingType) {
        const searchCombo = node.searchCombo;
        const searchQueries = searchCombo?.searchQueries || [];
        const combinator = searchCombo?.combinator || '';
        const isNot = Object.prototype.hasOwnProperty.call(node, 'isNot');
        if (this.evaluateEvent(eventData, searchQueries, combinator)) {
          if (node.minMatch) {
            const minMatch = node.minMatch - 1;
            node.minMatch = minMatch;
            if (minMatch > 0) {
              continue;
            }
          }
          if (isNot && !(i + 1 === localEventData.length)) {
            continue;
          }
          return true;
        } else if (isNot) {
          return false;
        }
      }
    }
    return false;
  }

  private evaluateEvent(
    localEvent: any,
    searchQueries: any,
    combinator: string
  ): boolean {
    if (combinator === 'And' || combinator === 'Or') {
      return this.evaluateFieldLogic(searchQueries, localEvent);
    } else if (combinator === 'Not') {
      return !this.evaluateFieldLogic(searchQueries, localEvent);
    }
    return false;
  }

  private doesItemCriteriaExists(searchQueries: any[]): boolean {
    const foundIndex = searchQueries.findIndex(
      (item) =>
        item.field.startsWith(UPDATECART_ITEM_PREFIX) ||
        item.field.startsWith(PURCHASE_ITEM_PREFIX)
    );
    return foundIndex !== -1;
  }

  private evaluateFieldLogic(searchQueries: any[], eventData: any): boolean {
    const localDataKeys = Object.keys(eventData);
    let itemMatchedResult = false;
    if (localDataKeys.includes(KEY_ITEMS)) {
      // scenario of items inside purchase and updateCart Events
      const items = eventData[KEY_ITEMS];
      const result = items.some((item: any) => {
        return this.doesItemMatchQueries(item, searchQueries);
      });
      if (!result && this.doesItemCriteriaExists(searchQueries)) {
        // items criteria existed and it did not match
        return result;
      }
      itemMatchedResult = result;
    }
    const filteredLocalDataKeys = localDataKeys.filter(
      (item: any) => item !== KEY_ITEMS
    );

    if (filteredLocalDataKeys.length === 0) {
      return itemMatchedResult;
    }

    const filteredSearchQueries = searchQueries.filter(
      (searchQuery) =>
        !searchQuery.field.startsWith(UPDATECART_ITEM_PREFIX) &&
        !searchQuery.field.startsWith(PURCHASE_ITEM_PREFIX)
    );
    if (filteredSearchQueries.length === 0) {
      return itemMatchedResult;
    }
    const matchResult = filteredSearchQueries.every((query: any) => {
      const field = query.field;
      const eventKeyItems = filteredLocalDataKeys.filter(
        (keyItem) => keyItem === field
      );
      if (eventKeyItems.length) {
        return this.evaluateComparison(
          query.comparatorType,
          eventData[field],
          query.value ? query.value : ''
        );
      }
      return false;
    });
    return matchResult;
  }

  private doesItemMatchQueries(item: any, searchQueries: any[]): boolean {
    const filteredSearchQueries = searchQueries.filter((searchQuery) =>
      Object.keys(item).includes(searchQuery.field)
    );
    if (filteredSearchQueries.length === 0) {
      return false;
    }
    return filteredSearchQueries.every((query: any) => {
      const field = query.field;
      if (Object.prototype.hasOwnProperty.call(item, field)) {
        return this.evaluateComparison(
          query.comparatorType,
          item[field],
          query.value ? query.value : ''
        );
      }
      return false;
    });
  }

  private evaluateComparison(
    comparatorType: string,
    matchObj: any,
    valueToCompare: string
  ): boolean {
    if (!valueToCompare && comparatorType !== 'IsSet') {
      return false;
    }
    switch (comparatorType) {
      case 'Equals':
        return this.compareValueEquality(matchObj, valueToCompare);
      case 'DoesNotEquals':
        return !this.compareValueEquality(matchObj, valueToCompare);
      case 'IsSet':
        return matchObj !== '';
      case 'GreaterThan':
      case 'LessThan':
      case 'GreaterThanOrEqualTo':
      case 'LessThanOrEqualTo':
        return this.compareNumericValues(
          matchObj,
          valueToCompare,
          comparatorType
        );
      case 'Contains':
        return this.compareStringContains(matchObj, valueToCompare);
      case 'StartsWith':
        return this.compareStringStartsWith(matchObj, valueToCompare);
      case 'MatchesRegex':
        return this.compareWithRegex(matchObj, valueToCompare);
      default:
        return false;
    }
  }

  private compareValueEquality(sourceTo: any, stringValue: string): boolean {
    if (
      (typeof sourceTo === 'number' || typeof sourceTo === 'boolean') &&
      stringValue !== '' &&
      !isNaN(parseFloat(stringValue))
    ) {
      if (typeof sourceTo === 'number') {
        return sourceTo === parseFloat(stringValue);
      } else if (typeof sourceTo === 'boolean') {
        return sourceTo === (stringValue === 'true');
      }
    } else if (typeof sourceTo === 'string') {
      return sourceTo === stringValue;
    }
    return false;
  }

  private compareNumericValues(
    sourceTo: any,
    stringValue: string,
    compareOperator: string
  ): boolean {
    if (!isNaN(parseFloat(stringValue))) {
      const sourceNumber = parseFloat(sourceTo);
      const numericValue = parseFloat(stringValue);
      switch (compareOperator) {
        case 'GreaterThan':
          return sourceNumber > numericValue;
        case 'LessThan':
          return sourceNumber < numericValue;
        case 'GreaterThanOrEqualTo':
          return sourceNumber >= numericValue;
        case 'LessThanOrEqualTo':
          return sourceNumber <= numericValue;
        default:
          return false;
      }
    }
    return false;
  }

  private compareStringContains(sourceTo: any, stringValue: string): boolean {
    return (
      (typeof sourceTo === 'string' || typeof sourceTo === 'object') &&
      sourceTo.includes(stringValue)
    );
  }

  private compareStringStartsWith(sourceTo: any, stringValue: string): boolean {
    return typeof sourceTo === 'string' && sourceTo.startsWith(stringValue);
  }

  private compareWithRegex(sourceTo: string, pattern: string): boolean {
    try {
      const regexPattern = new RegExp(pattern);
      return regexPattern.test(sourceTo);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  private handleException(e: any) {
    console.error('Exception occurred', e.toString());
  }

  private handleJSONException(e: any) {
    console.error('JSONException occurred', e.toString());
  }
}

export default CriteriaCompletionChecker;
