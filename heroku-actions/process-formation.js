module.exports = (formationData) => {
  const formation = {
    new: [],
    old: [],
  };

  formationData.forEach((formationObj) => {
    if (formationObj.quantity < 1) formationObj.quantity = 1;

    formation.old.push({
      quantity: formationObj.quantity ,
      size: formationObj.size,
      type: formationObj.type,
    });
    formation.new.push({
      quantity: 0,
      size: formationObj.size,
      type: formationObj.type,
    });
  });

  return formation;
};
