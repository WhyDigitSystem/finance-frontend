import apiCalls from 'apicall';

export const getAllActiveCountries = async (orgId) => {
  try {
    const response = await apiCalls('get', `commonmaster/country?orgid=${orgId}`);
    if (response.status === true) {
      const countryData = response.paramObjectsMap.countryVO
        .filter((row) => row.active === 'Active')
        .map(({ id, countryName, countryCode }) => ({ id, countryName, countryCode }));

      return countryData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveStatesByCountry = async (country, orgId) => {
  try {
    const response = await apiCalls('get', `commonmaster/state/country?country=${country}&orgid=${orgId}`);
    if (response.status === true) {
      const countryData = response.paramObjectsMap.stateVO
        .filter((row) => row.active === 'Active')
        .map(({ id, country, stateCode, stateName }) => ({ id, country, stateCode, stateName }));

      return countryData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveCitiesByState = async (state, orgId) => {
  try {
    const response = await apiCalls('get', `commonmaster/city/state?orgid=${orgId}&state=${state}`);
    if (response.status === true) {
      const cityData = response.paramObjectsMap.cityVO
        .filter((row) => row.active === 'Active')
        .map(({ id, cityName, cityCode }) => ({ id, cityName, cityCode }));

      return cityData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveCurrency = async (orgId) => {
  try {
    const response = await apiCalls('get', `commonmaster/currency?orgid=${orgId}`);
    if (response.status === true) {
      const currencyData = response.paramObjectsMap.currencyVO
        .filter((row) => row.active === 'Active')
        .map(({ id, currency, currencySymbol, subCurrency, country }) => ({ id, currency, currencySymbol, subCurrency, country }));

      return currencyData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveEmployees = async (orgId) => {
  try {
    const response = await apiCalls('get', `warehousemastercontroller/getAllEmployeeByOrgId?orgId=${orgId}`);
    if (response.status === true) {
      const empData = response.paramObjectsMap.employeeVO
        .filter((row) => row.active === 'Active')
        .map(({ id, employeeName, employeeCode }) => ({ id, employeeName, employeeCode }));
      return empData;
    } else {
      console.error('API Error:');
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveUnits = async (orgId) => {
  try {
    const response = await apiCalls('get', `warehousemastercontroller/getAllUnitByOrgId?orgid=${orgId}`);
    if (response.status === true) {
      const unitData = response.paramObjectsMap.unitVO
        .filter((row) => row.active === 'Active')
        .map(({ id, unitName, unitType }) => ({ id, unitName, unitType }));
      return unitData;
    } else {
      console.error('API Error:');
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveRegions = async (orgId) => {
  try {
    const response = await apiCalls('get', `commonmaster/getAllRegionsByOrgId?orgId=${orgId}`);
    if (response.status === true) {
      const empData = response.paramObjectsMap.regionVO
        .filter((row) => row.active === 'Active')
        .map(({ id, regionName, regionCode }) => ({ id, regionName, regionCode }));
      return empData;
    } else {
      console.error('API Error:');
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const getAllActiveScreens = async () => {
  try {
    const response = await apiCalls('get', `/commonmaster/getAllScreenNames`);
    console.log('API Response:', response);

    if (response.status === true) {
      const screensData = response.paramObjectsMap.screenNamesVO
        .filter((row) => row.active === 'Active')
        .map(({ id, screenCode, screenName }) => ({ id, screenCode, screenName }));

      return screensData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const getAllActiveRoles = async (orgId) => {
  try {
    const response = await apiCalls('get', `auth/allRolesByOrgId?orgId=${orgId}`);
    console.log('API Response:', response);

    if (response.status === true) {
      const rolesData = response.paramObjectsMap.rolesVO.filter((row) => row.active === 'Active').map(({ id, role }) => ({ id, role }));

      return rolesData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};
export const getAllActiveBranches = async (orgId) => {
  try {
    const response = await apiCalls('get', `master/branch?orgid=${orgId}`);
    console.log('API Response:', response);

    if (response.status === true) {
      const branchData = response.paramObjectsMap.branchVO
        .filter((row) => row.active === 'Active')
        .map(({ id, branch, branchCode }) => ({ id, branch, branchCode }));

      return branchData;
    } else {
      console.error('API Error:', response);
      return response;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return error;
  }
};

export const initCaps = (str) => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
