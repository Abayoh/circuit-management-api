exports.create = async (data, res, model, findBy) => {
  try {
    //check for unique objects in array of objects
    if (findBy) {
      const existingData = await model.findOne({
        [findBy]: model[findBy],
      });
      if (existingData) {
        return res.status(400).json({ msg: `This ${findBy} already exists` });
      }
    }
    const result = await model.create(data);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.readAll = async (res, model) => {
  try {
    let data = await model.find({});
    //TODO: remove this part after development
    data = data.map((d) => {
      let obj = d.toObject();
      if (obj.id) {
        let newObj = { ...obj, _id: obj.id };
        delete newObj.id;
        return newObj;
      }
      return obj;
    });
    //todo ends here
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updateOne = async (req, res, model) => {
  try {
    const data = await req.body;
    const { id } = req.params;
    const { modifiedCount } = await model.updateOne({ _id: id }, data);
    if (modifiedCount === 0) {
      return res.status(500).json({
        success: false,
        msg: '0 modified',
      });
    }
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
