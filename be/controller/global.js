const country = require('countryjs');

exports.getCountries = (req, res) => {
    try {
      const all = country.all();
      const data = all
        .filter(item => item.name) // Filter out entries with empty name
        .map(item => item.name);
      
      return res.json({ status: 200, msg: 'success', data });
    } catch (error) {
      return res.json({ status: 400, msg: 'Error occurred!' });
    }
  };