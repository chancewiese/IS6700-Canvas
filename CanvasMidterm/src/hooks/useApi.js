import { getFromLocalStorageDB, saveToLocalStorageDB } from "../apiV3";

export const useApi = (tableName) => {
   return {
      getAll: async () => {
         return getFromLocalStorageDB(tableName) || [];
      },
      getAllGroupedBy: async (field) => {
         const data = getFromLocalStorageDB(tableName) || [];
         return data.reduce((acc, d) => {
            if (!acc[d[field]]) {
               acc[d[field]] = [];
            }
            acc[d[field]].push(d);
            return acc;
         }, {});
      },
      getById: async (id) => {
         const data = getFromLocalStorageDB(tableName) || [];
         return data.find((d) => d.id === id);
      },
      getByField: async (field, value) => {
         const data = getFromLocalStorageDB(tableName) || [];
         return data.find((d) => d[field] === value);
      },
      create: async (data) => {
         const id = String(Math.floor(Math.random() * 100000000));
         const items = getFromLocalStorageDB(tableName) || [];
         items.push({ id, ...data });
         saveToLocalStorageDB(tableName, items);
         return id;
      },
      bulkCreate: async (data) => {
         const items = getFromLocalStorageDB(tableName) || [];
         const newItems = data.map((d) => ({
            id: String(Math.floor(Math.random() * 100000000)),
            ...d,
         }));
         saveToLocalStorageDB(tableName, [...items, ...newItems]);
      },
      update: async (id, data) => {
         const items = getFromLocalStorageDB(tableName) || [];
         const index = items.findIndex((d) => d.id === id);
         items[index] = { id, ...data };
         saveToLocalStorageDB(tableName, items);
      },
      delete: async (id) => {
         const items = getFromLocalStorageDB(tableName) || [];
         const newItems = items.filter((d) => d.id !== id);
         saveToLocalStorageDB(tableName, newItems);
      },
      deleteAll: async () => {
         saveToLocalStorageDB(tableName, []);
      },
   };
};
