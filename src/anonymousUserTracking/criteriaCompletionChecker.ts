/* eslint-disable class-methods-use-this */
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
  PURCHASE_ITEM_PREFIX,
  PURCHASE_ITEM
} from '../constants';

interface SearchQuery {
  combinator: string;
  /* eslint-disable-next-line no-use-before-define */
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
          updatedItem[PURCHASE_ITEM] = items;
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
          // eslint-disable-next-line no-param-reassign
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
          // eslint-disable-next-line no-param-reassign
          delete localEventData.dataFields;
        }
        nonPurchaseEvents.push(updatedItem);
      }
    });
    return nonPurchaseEvents;
  }

  private evaluateTree(
    node: SearchQuery | Criteria,
    localEventData: any[]
  ): boolean {
    try {
      if ((node as SearchQuery).searchQueries) {
        const { combinator } = node as SearchQuery;
        const { searchQueries } = node as SearchQuery;
        if (combinator === 'And') {
          /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
          for (let i = 0; i < searchQueries.length; i += 1) {
            if (!this.evaluateTree(searchQueries[i], localEventData)) {
              return false;
            }
          }
          return true;
        }
        if (combinator === 'Or') {
          /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
          for (let i = 0; i < searchQueries.length; i += 1) {
            if (this.evaluateTree(searchQueries[i], localEventData)) {
              return true;
            }
          }
          return false;
        }
        if (combinator === 'Not') {
          /* eslint-disable-next-line @typescript-eslint/prefer-for-of */
          for (let i = 0; i < searchQueries.length; i += 1) {
            (searchQueries[i] as any).isNot = true;
            if (this.evaluateTree(searchQueries[i], localEventData)) {
              return false;
            }
          }
          return true;
        }
      } else if ((node as SearchQuery).searchCombo) {
        return this.evaluateSearchQueries(node as SearchQuery, localEventData);
      }
    } catch (e) {
      this.handleException(e);
    }
    return false;
  }

  /* eslint-disable no-continue */
  private evaluateSearchQueries(
    node: SearchQuery,
    localEventData: any[]
  ): boolean {
    // this function will compare the actualy searhqueues under search combo
    for (let i = 0; i < localEventData.length; i += 1) {
      const eventData = localEventData[i];
      const trackingType = eventData[SHARED_PREFS_EVENT_TYPE];
      const { dataType } = node;
      if (dataType === trackingType) {
        const { searchCombo } = node;
        const searchQueries = searchCombo?.searchQueries || [];
        const combinator = searchCombo?.combinator || '';
        const isNot = Object.prototype.hasOwnProperty.call(node, 'isNot');
        if (this.evaluateEvent(eventData, searchQueries, combinator)) {
          if (node.minMatch) {
            const minMatch = node.minMatch - 1;
            // eslint-disable-next-line no-param-reassign
            node.minMatch = minMatch;
            if (minMatch > 0) {
              continue;
            }
          }
          if (isNot && !(i + 1 === localEventData.length)) {
            continue;
          }
          return true;
        }
        if (isNot) {
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
    }
    if (combinator === 'Not') {
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
    let keyItem = null;
    if (localDataKeys.includes(KEY_ITEMS)) {
      keyItem = KEY_ITEMS;
    } else if (localDataKeys.includes(PURCHASE_ITEM)) {
      keyItem = PURCHASE_ITEM;
    }

    if (keyItem !== null) {
      // scenario of items inside purchase and updateCart Events
      const items = eventData[keyItem];
      const result = items.some((item: any) =>
        this.doesItemMatchQueries(item, searchQueries)
      );
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
      const { field } = query;
      if (
        query.dataType === TRACK_EVENT &&
        query.fieldType === 'object' &&
        query.comparatorType === 'IsSet'
      ) {
        const eventName = eventData[KEY_EVENT_NAME];
        if (eventName === UPDATE_CART && field === eventName) {
          return true;
        }
        if (field === eventName) {
          return true;
        }
      }

      if (field.includes('.')) {
        let fields = field.split('.');
        if (Array.isArray(eventData[fields[0]])) {
          return eventData[fields[0]]?.every((item: any) => {
            const data = {
              [fields[0]]: item,
              eventType: query?.eventType
            };
            const valueFromObj = this.getFieldValue(data, field);
            if (valueFromObj) {
              return this.evaluateComparison(
                query.comparatorType,
                valueFromObj,
                query.value ? query.value : ''
              );
            }
            return false;
          });
        }

        const valueFromObj = this.getFieldValue(eventData, field);
        if (valueFromObj) {
          return this.evaluateComparison(
            query.comparatorType,
            valueFromObj,
            query.value ? query.value : ''
          );
        }
      }
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

  private getFieldValue(data: any, field: string): any {
    let fields = field.split('.');
    if (data?.eventType === TRACK_EVENT && data?.eventName === fields[0]) {
      fields = [fields[fields.length - 1]];
    }
    return fields.reduce(
      (value, currentField) =>
        value && value[currentField] !== undefined
          ? value[currentField]
          : undefined,
      data
    );
  }

  private doesItemMatchQueries(item: any, searchQueries: any[]): boolean {
    let shouldReturn = false;
    const filteredSearchQueries = searchQueries.filter((searchQuery) => {
      if (
        searchQuery.field.startsWith(UPDATECART_ITEM_PREFIX) ||
        searchQuery.field.startsWith(PURCHASE_ITEM_PREFIX)
      ) {
        if (!Object.keys(item).includes(searchQuery.field)) {
          shouldReturn = true;
          return false;
        }
        return true;
      }
      return false;
    });
    if (filteredSearchQueries.length === 0 || shouldReturn) {
      return false;
    }
    return filteredSearchQueries.every((query: any) => {
      const { field } = query;
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
      case 'DoesNotEqual':
        return !this.compareValueEquality(matchObj, valueToCompare);
      case 'IsSet':
        return this.issetCheck(matchObj);
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
      stringValue !== ''
    ) {
      // eslint-disable-next-line no-restricted-globals
      if (typeof sourceTo === 'number' && !isNaN(parseFloat(stringValue))) {
        return sourceTo === parseFloat(stringValue);
      }
      if (typeof sourceTo === 'boolean') {
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
    // eslint-disable-next-line no-restricted-globals
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

  private issetCheck(matchObj: string | object | any[]): boolean {
    if (Array.isArray(matchObj)) {
      return matchObj.length > 0;
    }
    if (typeof matchObj === 'object' && matchObj !== null) {
      return Object.keys(matchObj).length > 0;
    }
    return matchObj !== '';
  }

  private handleException(e: any) {
    console.error('Exception occurred', e.toString());
  }

  private handleJSONException(e: any) {
    console.error('JSONException occurred', e.toString());
  }
}

export default CriteriaCompletionChecker;
