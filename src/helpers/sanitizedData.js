export const sanitizedData = (data) => {
  return data.map((item) => {
    // Replace null values with an empty string for each property
    const updatedItem = {};
    for (const key in item) {
      updatedItem[key] = item[key] === null ? '' : item[key];
    }
    return updatedItem;
  });
};
