function prepareDesignForReq(colors, fonts) {
  const designObjs = [{}, {}, {}];

  const preparedDesignObjs = designObjs.map((obj, i) => {
    const preparedObj = {
      shopDesignTypeId: i + 1,
      hex: colors[i],
      font: fonts[i]?.font,
      size: fonts[i]?.size,
      italic: fonts[i]?.italic ? 1 : 0,
      weight: Number(fonts[i]?.weight),
    };

    return preparedObj;
  });

  return preparedDesignObjs;
}

export default prepareDesignForReq;
