const getDesign = designData => {
    let titleDesign;
    let subTitleDesign;
    let additionalDesign;
    designData.forEach(el => {
        if (el.landingDesignTypeId === 1) {
            titleDesign = { ...el };
        } else if (el.landingDesignTypeId === 2) {
            subTitleDesign = { ...el };
        } else if (el.landingDesignTypeId === 3) {
            additionalDesign = { ...el };
        }
    });
    return {titleDesign, subTitleDesign, additionalDesign}
};

export default getDesign