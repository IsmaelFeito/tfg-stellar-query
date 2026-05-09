// src/mocks/schemas.mock.ts

export interface SchemaCol {
  col:  string
  type: string
  pk?:  boolean
  fk?:  boolean
}

export const SCHEMAS: Record<string, SchemaCol[]> = {
  crew_mates: [
    { col: 'id',       type: 'BIGINT',      pk: true  },
    { col: 'name',     type: 'VARCHAR(50)'            },
    { col: 'range',    type: 'INTEGER'                },
    { col: 'state',    type: 'ENUM'                   },
    { col: 'joined',   type: 'DATE'                   },
    { col: 'id_ships', type: 'INTEGER',     fk: true  },
    { col: 'id_dept',  type: 'INTEGER',     fk: true  },
  ],
  ships: [
    { col: 'id',          type: 'BIGINT',   pk: true  },
    { col: 'name',        type: 'VARCHAR(100)'        },
    { col: 'description', type: 'VARCHAR(200)'        },
  ],
  departaments: [
    { col: 'id',       type: 'BIGINT',      pk: true  },
    { col: 'dep_name', type: 'VARCHAR(100)'           },
  ],
  class: [
    { col: 'id',   type: 'BIGINT',          pk: true  },
    { col: 'name', type: 'VARCHAR(50)'                },
  ],
  ships_class: [
    { col: 'id_ships', type: 'INTEGER',     fk: true  },
    { col: 'id_class', type: 'INTEGER',     fk: true  },
  ],
}

// Qué tablas muestra cada misión (por id de misión)
export const MISION_TABLAS: Record<number, string[]> = {
  1:  ['crew_mates'],
  2:  ['crew_mates'],
  3:  ['crew_mates'],
  4:  ['ships'],
  5:  ['crew_mates'],
  6:  ['crew_mates', 'ships'],
  7:  ['departaments', 'crew_mates'],
  8:  ['crew_mates', 'ships', 'departaments'],
  9:  ['ships', 'crew_mates'],
  10: ['crew_mates', 'ships'],
}