export const data = [
  {
    SNo: '1',
    company: 'Company 1',
    loc: 'Madurai'
  },
  {
    SNo: '2',
    company: 'Company 2',
    loc: 'Dindigul'
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
