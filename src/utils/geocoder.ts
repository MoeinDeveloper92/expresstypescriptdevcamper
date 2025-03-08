const geocodedAddress = async (address: string) => {
  try {
    //@TODO: use SDK instead of direct fetch request!
    const res = await fetch(
      `${process.env.GEOCODER_ENDPOINT}?q=${address}&apikey=${process.env.GEOCODER_API_KEY}`
    );
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export { geocodedAddress };

// const options = {
//   provider: process.env.GEOCODER_ID,
//   httpAdapter: process.env.GEOCODER_API_KEY,
//   formatter: null,
// };
