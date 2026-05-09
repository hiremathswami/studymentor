/**
 * @file src/lib/supabase.js
 * @description Single Supabase client instance for backend operations.
 *              Includes a full in-memory mock for local development.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[Supabase Lib] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

// Create the Supabase client only if keys are present and not dummy
let supabase;
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL !== 'https://dummy.supabase.co') {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
} else {
  console.warn('[Supabase Lib] Running in MOCK mode. Please set SUPABASE_URL in .env');

  // ── Persistent In-Memory Mock Database ────────────────────────────
  const fs = require('fs');
  const path = require('path');
  const DB_PATH = path.join(process.cwd(), 'mock_db.json');

  let mockDB = {
    users: [],
    study_plans: [],
    daily_tasks: [],
    explanations: [],
    quiz_results: [],
    progress_logs: [],
  };

  // Load from file if exists
  if (fs.existsSync(DB_PATH)) {
    try {
      mockDB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
      console.log('[Supabase Lib] Loaded persistent mock DB from mock_db.json');
    } catch (e) {
      console.error('[Supabase Lib] Failed to parse mock_db.json, using empty state');
    }
  }

  const saveDB = () => {
    fs.writeFileSync(DB_PATH, JSON.stringify(mockDB, null, 2));
  };

  // Helper: find user by id
  const findUser = (id) => mockDB.users.find(u => u.id === id);

  /**
   * Build a chainable mock query builder that tracks table, filters, and operations.
   */
  function createChain(tableName) {
    let filters = {};
    let insertData = null;
    let updateData = null;

    const chain = {
      select: () => chain,

      insert: (data) => {
        insertData = Array.isArray(data) ? data[0] : data;
        // Assign an ID if missing
        if (!insertData.id) insertData.id = 'mock-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7);
        insertData.created_at = insertData.created_at || new Date().toISOString();
        mockDB[tableName] = mockDB[tableName] || [];
        mockDB[tableName].push(insertData);
        saveDB(); // Persist
        return chain;
      },

      update: (data) => {
        updateData = data;
        return chain;
      },

      eq: (field, value) => {
        filters[field] = { type: 'eq', value };
        // If we have updateData, apply the update now
        if (updateData && mockDB[tableName]) {
          mockDB[tableName] = mockDB[tableName].map(row => {
            if (row[field] === value) return { ...row, ...updateData };
            return row;
          });
          saveDB(); // Persist
        }
        return chain;
      },
      
      gte: (field, value) => {
        filters[field] = { type: 'gte', value };
        return chain;
      },
      
      order: (field, options = { ascending: true }) => {
        filters['_order'] = { field, ascending: options.ascending };
        return chain;
      },

      single: async () => {
        // If we just inserted, return the inserted data
        if (insertData) {
          return { data: insertData, error: null };
        }
        // Query mock database for existing record
        const table = mockDB[tableName] || [];
        const match = table.find(row =>
          Object.entries(filters).every(([k, v]) => {
            if (k === '_order') return true;
            if (v && v.type === 'eq') return row[k] === v.value;
            if (v && v.type === 'gte') return row[k] >= v.value;
            return row[k] === v;
          })
        );
        if (match) return { data: match, error: null };

        // Fallback defaults ONLY if not found in mockDB
        if (tableName === 'users') {
          const id = (filters.id && filters.id.value) || 'mock-id';
          return {
            data: { id, name: 'Student', email: 'demo@student.edu', plan: 'free', theme: 'light', explanation_count: 0 },
            error: null
          };
        }
        return { data: null, error: null };
      },

      maybeSingle: async () => {
        if (insertData) {
          return { data: insertData, error: null };
        }
        const table = mockDB[tableName] || [];
        const match = table.find(row =>
          Object.entries(filters).every(([k, v]) => {
            if (k === '_order') return true;
            if (v && v.type === 'eq') return row[k] === v.value;
            if (v && v.type === 'gte') return row[k] >= v.value;
            return row[k] === v;
          })
        );
        return { data: match || null, error: null };
      },
      
      // Make chain "thenable" so it acts as a Promise for array queries
      then: function(resolve, reject) {
        if (insertData) return resolve({ data: [insertData], error: null });
        
        const table = mockDB[tableName] || [];
        let results = table.filter(row => {
          return Object.entries(filters).every(([k, v]) => {
            if (k === '_order') return true;
            if (v && v.type === 'gte') return row[k] >= v.value;
            if (v && v.type === 'eq') return row[k] === v.value;
            // Backwards compat for old mock code
            if (typeof v !== 'object' || v === null) return row[k] === v;
            return true;
          });
        });
        
        const _order = filters['_order'];
        if (_order) {
          results.sort((a, b) => {
            if (a[_order.field] < b[_order.field]) return _order.ascending ? -1 : 1;
            if (a[_order.field] > b[_order.field]) return _order.ascending ? 1 : -1;
            return 0;
          });
        }
        resolve({ data: results, error: null });
      }
    };

    return chain;
  }

  supabase = {
    auth: {
      getUser: async (token) => {
        const userId = token ? token.replace('mock-token-', '') : 'mock-id';
        const user = mockDB.users.find(u => u.id === userId) || { id: 'mock-id', email: 'demo@student.edu' };
        return {
          data: { user: { id: user.id, email: user.email } },
          error: null
        };
      },
      signOut: async () => ({ error: null }),
      signUp: async ({ email, password }) => {
        const userId = 'mock-' + Date.now();
        return {
          data: {
            user: { id: userId, email },
            session: { access_token: 'mock-token-' + userId }
          },
          error: null
        };
      },
      signInWithPassword: async ({ email, password }) => {
        const user = mockDB.users.find(u => u.email === email) || { id: 'mock-id', email };
        return {
          data: {
            user: { id: user.id, email: user.email || email },
            session: { access_token: 'mock-token-' + user.id }
          },
          error: null
        };
      }
    },
    from: (tableName) => createChain(tableName),
    rpc: async () => ({ error: null }),
  };
}

module.exports = supabase;
