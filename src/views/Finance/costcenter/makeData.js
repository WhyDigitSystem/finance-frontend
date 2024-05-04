export const data = [
  {
    SNo: '1',
    ListOfAccounts: 'four'
  },
  {
    SNo: '2',
    ListOfAccounts: 'five'
  }

  // Add more sample data objects as needed...
];

// Function to generate sample data
export function makeData(count = 20) {
  const newData = [];
  for (let i = 1; i <= count; i++) {
    newData.push({
      id: i,
      ListOfAccounts: `First ${i}`
    });
  }
  return newData;
}
