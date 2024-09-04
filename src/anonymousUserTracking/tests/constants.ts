// CRITERIA TEST CONSTANTS

export const DATA_TYPE_COMPARATOR_EQUALS = {
  count: 1,
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
  criterias: [
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
