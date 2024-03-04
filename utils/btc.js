const fetchCurrentPrice = async () => {
  const currentPriceRes = await fetch(
    "https://api.coindesk.com/v1/bpi/currentprice.json"
  );
  const currentPriceResJson = await currentPriceRes.json();
  const currentBtcPrice = currentPriceResJson.bpi.USD.rate_float;
  console.log("🚀 ~ scanBtcTransaction ~ currentBtcPrice:", currentBtcPrice);

  return currentBtcPrice;
};

module.exports = { fetchCurrentPrice };
