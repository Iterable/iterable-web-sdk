// CRITERIA TEST CONSTANTS

export const DATA_TYPE_COMPARATOR_EQUALS = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'Equals',
                      value: '3',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'Equals',
                      value: '19.99',
                      fieldType: 'double'
                    },
                    {
                      dataType: 'user',
                      field: 'likes_boba',
                      comparatorType: 'Equals',
                      value: 'true',
                      fieldType: 'boolean'
                    },
                    {
                      dataType: 'user',
                      field: 'country',
                      comparatorType: 'Equals',
                      value: 'Chaina',
                      fieldType: 'String'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_DOES_NOT_EQUAL = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'DoesNotEqual',
                      value: '3',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'DoesNotEqual',
                      value: '19.99',
                      fieldType: 'double'
                    },
                    {
                      dataType: 'user',
                      field: 'likes_boba',
                      comparatorType: 'DoesNotEqual',
                      value: 'true',
                      fieldType: 'boolean'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_LESS_THAN = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '289',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'LessThan',
                      value: '15',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'LessThan',
                      value: '15',
                      fieldType: 'double'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_LESS_THAN_OR_EQUAL_TO = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '290',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'LessThanOrEqualTo',
                      value: '17',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'LessThanOrEqualTo',
                      value: '17',
                      fieldType: 'double'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_GREATER_THAN = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '290',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'GreaterThan',
                      value: '50',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'GreaterThan',
                      value: '55',
                      fieldType: 'double'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_GREATER_THAN_OR_EQUAL_TO = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '291',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'GreaterThanOrEqualTo',
                      value: '20',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'GreaterThanOrEqualTo',
                      value: '20',
                      fieldType: 'double'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const DATA_TYPE_COMPARATOR_IS_SET = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'eventTimeStamp',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'long'
                    },
                    {
                      dataType: 'user',
                      field: 'savings',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'double'
                    },
                    {
                      dataType: 'user',
                      field: 'saved_cars',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'double'
                    },
                    {
                      dataType: 'user',
                      field: 'country',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'double'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_EQUAL_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_Array_Equal',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'Equals',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'score',
                      fieldType: 'double',
                      comparatorType: 'Equals',
                      dataType: 'user',
                      id: 2,
                      value: '11.5'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'timestamp',
                      fieldType: 'long',
                      comparatorType: 'Equals',
                      dataType: 'user',
                      id: 2,
                      valueLong: 1722500215276,
                      value: '1722500215276'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'button-clicked.animal',
                      fieldType: 'string',
                      comparatorType: 'Equals',
                      dataType: 'customEvent',
                      id: 25,
                      value: 'giraffe'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_DOES_NOT_EQUAL_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_Array_DoesNotEqual',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'DoesNotEqual',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'score',
                      fieldType: 'double',
                      comparatorType: 'DoesNotEqual',
                      dataType: 'user',
                      id: 2,
                      value: '11.5'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'timestamp',
                      fieldType: 'long',
                      comparatorType: 'DoesNotEqual',
                      dataType: 'user',
                      id: 2,
                      valueLong: 1722500215276,
                      value: '1722500215276'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'button-clicked.animal',
                      fieldType: 'string',
                      comparatorType: 'DoesNotEqual',
                      dataType: 'customEvent',
                      id: 25,
                      value: 'giraffe'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_GREATER_THAN_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'GreaterThan',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_LESS_THAN_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'LessThan',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_GREATER_THAN_EQUAL_TO_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'GreaterThanOrEqualTo',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_LESS_THAN_EQUAL_TO_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'milestoneYears',
                      fieldType: 'string',
                      comparatorType: 'LessThanOrEqualTo',
                      dataType: 'user',
                      id: 2,
                      value: '1997'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_CONTAINS_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'addresses',
                      fieldType: 'string',
                      comparatorType: 'Contains',
                      dataType: 'user',
                      id: 2,
                      value: 'US'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_STARTSWITH_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'addresses',
                      fieldType: 'string',
                      comparatorType: 'StartsWith',
                      dataType: 'user',
                      id: 2,
                      value: 'US'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const ARRAY_MATCHREGEX_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '285',
      name: 'Criteria_EventTimeStamp_3_Long',
      createdAt: 1722497422151,
      updatedAt: 1722500235276,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      field: 'addresses',
                      fieldType: 'string',
                      comparatorType: 'MatchesRegex',
                      dataType: 'user',
                      id: 2,
                      value: '^(JP|DE|GB)'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const NESTED_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '168',
      name: 'nested testing',
      createdAt: 1721251169153,
      updatedAt: 1723488175352,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'furniture',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'nested'
                    },
                    {
                      dataType: 'user',
                      field: 'furniture.furnitureType',
                      comparatorType: 'Equals',
                      value: 'Sofa',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'user',
                      field: 'furniture.furnitureColor',
                      comparatorType: 'Equals',
                      value: 'White',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const NESTED_CRITERIA_MULTI_LEVEL = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '425',
      name: 'Multi level Nested field criteria',
      createdAt: 1721251169153,
      updatedAt: 1723488175352,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'button-clicked.browserVisit.website.domain',
                      comparatorType: 'Equals',
                      value: 'https://mybrand.com/socks',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const NESTED_CRITERIA_MULTI_LEVEL_ARRAY = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '436',
      name: 'Criteria 2.1 - 09252024 Bug Bash',
      createdAt: 1727286807360,
      updatedAt: 1727445082036,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'furniture.material.type',
                      comparatorType: 'Contains',
                      value: 'table',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'user',
                      field: 'furniture.material.color',
                      comparatorType: 'Equals',
                      values: ['black']
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const IS_ONE_OF_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '299',
      name: 'Criteria_Is_One_of',
      createdAt: 1722851586508,
      updatedAt: 1724404229481,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'country',
                      comparatorType: 'Equals',
                      values: ['China', 'Japan', 'Kenya']
                    },
                    {
                      dataType: 'user',
                      field: 'addresses',
                      comparatorType: 'Equals',
                      values: ['JP', 'DE', 'GB']
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const IS_NOT_ONE_OF_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '299',
      name: 'Criteria_Is_Not_One_of',
      createdAt: 1722851586508,
      updatedAt: 1724404229481,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'country',
                      comparatorType: 'DoesNotEqual',
                      values: ['China', 'Japan', 'Kenya']
                    },
                    {
                      dataType: 'user',
                      field: 'addresses',
                      comparatorType: 'DoesNotEqual',
                      values: ['JP', 'DE', 'GB']
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const CUSTOM_EVENT_API_TEST_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '6',
      name: 'EventCriteria',
      createdAt: 1704754280210,
      updatedAt: 1704754280210,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'eventName',
                      comparatorType: 'Equals',
                      value: 'animal-found',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.type',
                      comparatorType: 'Equals',
                      value: 'cat',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.count',
                      comparatorType: 'Equals',
                      value: '6',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.vaccinated',
                      comparatorType: 'Equals',
                      value: 'true',
                      fieldType: 'boolean'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const USER_UPDATE_API_TEST_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '6',
      name: 'UserCriteria',
      createdAt: 1704754280210,
      updatedAt: 1704754280210,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'furniture.furnitureType',
                      comparatorType: 'Equals',
                      value: 'Sofa',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'user',
                      field: 'furniture.furnitureColor',
                      comparatorType: 'Equals',
                      value: 'White',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const USER_MERGE_SCENARIO_CRITERIA = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '6',
      name: 'EventCriteria',
      createdAt: 1704754280210,
      updatedAt: 1704754280210,
      searchQuery: {
        combinator: 'Or',
        searchQueries: [
          {
            combinator: 'Or',
            searchQueries: [
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'eventName',
                      comparatorType: 'Equals',
                      value: 'testEvent',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

// MARK:Complex Criteria

export const COMPLEX_CRITERIA_1 = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '290',
      name: 'Complex Criteria Unit Test #1',
      createdAt: 1722532861551,
      updatedAt: 1722532861551,
      searchQuery: {
        combinator: 'And',
        searchQueries: [
          {
            combinator: 'Or',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'A',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'B',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'C',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          },
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'eventName',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'saved_cars.color',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'eventName',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.vaccinated',
                      comparatorType: 'Equals',
                      value: 'true',
                      fieldType: 'boolean'
                    }
                  ]
                }
              }
            ]
          },
          {
            combinator: 'Not',
            searchQueries: [
              {
                dataType: 'purchase',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      field: 'total',
                      comparatorType: 'LessThanOrEqualTo',
                      value: '100',
                      fieldType: 'double'
                    }
                  ]
                }
              },
              {
                dataType: 'purchase',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      field: 'reason',
                      comparatorType: 'Equals',
                      value: 'null',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const COMPLEX_CRITERIA_2 = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '291',
      name: 'Complex Criteria Unit Test #2',
      createdAt: 1722533473263,
      updatedAt: 1722533473263,
      searchQuery: {
        combinator: 'Or',
        searchQueries: [
          {
            combinator: 'Not',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'A',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'B',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'C',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          },
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'eventName',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'string'
                    },
                    {
                      dataType: 'customEvent',
                      field: 'saved_cars.color',
                      comparatorType: 'IsSet',
                      value: '',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.vaccinated',
                      comparatorType: 'Equals',
                      value: 'true',
                      fieldType: 'boolean'
                    }
                  ]
                }
              }
            ]
          },
          {
            combinator: 'Or',
            searchQueries: [
              {
                dataType: 'purchase',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      field: 'total',
                      comparatorType: 'GreaterThanOrEqualTo',
                      value: '100',
                      fieldType: 'double'
                    }
                  ]
                }
              },
              {
                dataType: 'purchase',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'purchase',
                      field: 'reason',
                      comparatorType: 'DoesNotEqual',
                      value: 'null',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};

export const COMPLEX_CRITERIA_3 = {
  count: 1,
  criteriaSets: [
    {
      criteriaId: '292',
      name: 'Complex Criteria Unit Test #3',
      createdAt: 1722533789589,
      updatedAt: 1722533838989,
      searchQuery: {
        combinator: 'Not',
        searchQueries: [
          {
            combinator: 'And',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'A',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'lastName',
                      comparatorType: 'StartsWith',
                      value: 'A',
                      fieldType: 'string'
                    }
                  ]
                }
              }
            ]
          },
          {
            combinator: 'Or',
            searchQueries: [
              {
                dataType: 'user',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'user',
                      field: 'firstName',
                      comparatorType: 'StartsWith',
                      value: 'C',
                      fieldType: 'string'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.vaccinated',
                      comparatorType: 'Equals',
                      value: 'false',
                      fieldType: 'boolean'
                    }
                  ]
                }
              },
              {
                dataType: 'customEvent',
                searchCombo: {
                  combinator: 'And',
                  searchQueries: [
                    {
                      dataType: 'customEvent',
                      field: 'animal-found.count',
                      comparatorType: 'LessThan',
                      value: '5',
                      fieldType: 'long'
                    }
                  ]
                }
              }
            ]
          }
        ]
      }
    }
  ]
};
