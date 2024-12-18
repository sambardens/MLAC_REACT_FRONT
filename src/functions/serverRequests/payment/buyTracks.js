const buyTracks = async (data, params, axiosPrivate) => {
  const controller = new AbortController();
  try {
    const { purchaseLocationTypeId, purchaseLocationId } = params;
    const res = await axiosPrivate.post(
      `/api/customers/payment?purchaseLocationTypeId=${purchaseLocationTypeId}&purchaseLocationId=${purchaseLocationId}`,
      data,
      {
        signal: controller.signal,
      },
    );
    console.log('buyTracks res: ', res);
    return res?.data;
  } catch (error) {
    console.log('buyTracks error:', error);
  }
};

export default buyTracks;
