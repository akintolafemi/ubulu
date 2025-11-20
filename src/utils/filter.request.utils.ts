export const filterRequestObject = (
  queryObj: Record<any, any>,
  array: string[],
  useDeleted = true,
) => {
  const obj = {};
  if (useDeleted) {
    Object.assign(obj, {
      deleted: false,
    });
  }
  // const obj = useDeleted
  //   ? {
  //       deleted: false,
  //     }
  //   : {};
  try {
    for (const key in queryObj) {
      if (array.includes(String(key)) && queryObj[key] !== undefined) {
        if (key.includes('.')) {
          const parentField = key.split('.')[0];
          const childField = key.split('.')[1];
          const subChildField = key.split('.')[2] || '';
          if (subChildField !== '') {
            obj[parentField] = obj[parentField] || {};
            obj[parentField][childField] = obj[parentField][childField] || {};
            obj[parentField][childField][subChildField] = queryObj[key];
          } else {
            obj[parentField] = obj[parentField] || {};
            obj[parentField][childField] = queryObj[key];
          }
        } else obj[key] = queryObj[key];
      }
    }
  } catch (error) {
    console.log(error);
  }
  return obj;
};
