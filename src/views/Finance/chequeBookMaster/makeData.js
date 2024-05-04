export const data = [
  {
    SNo: '1',
    chequeno: '1',
    status: 'Done',
    cancelled: 'Ok'
  },
  {
    SNo: '2',
    chequeno: '2',
    status: 'Done',
    cancelled: 'Ok'
  }

  // Add more sample data objects as needed...
];

// Function to generate sample data
export function makeData(count = 20) {
  const newData = [];
  for (let i = 1; i <= count; i++) {
    newData.push({
      id: i,
      commodityCategory: `First ${i}`,
      creator: `Last ${i}`,
      createTime: `email${i}@example.com`
    });
  }
  return newData;
}
