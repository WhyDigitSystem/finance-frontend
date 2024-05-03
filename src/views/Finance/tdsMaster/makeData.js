export const data = [
  {
    SNo: '1',
    FromDate: '11/01/2022',
    ToDate: '22/05/2022',
    Tds: '1',
    Sur: '10',
    Edcess: '100'
  },
  {
    SNo: '1',
    FromDate: '11/01/2022',
    ToDate: '22/05/2022',
    Tds: '1',
    Sur: '10',
    Edcess: '100'
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
