const createError = require('http-errors');

exports.create = async (data, res, model, next, findBy) => {
  try {
    
    if (findBy) {
      const existingData = await model.findOne({
        [findBy]: data[findBy],
      });
      if (existingData) {
        throw createError.Conflict(`This resource already exists`);
      }
    }
    const result = await model.create(data);
    return res.send(result);
  } catch (error) {
     next(error);
  }
};

exports.createMany = async (arr, res, model, next) => {
  try {
    //check for unique objects in array of objects

    const result = await model.insertMany(arr);
    console.log(result);
    return res.send(result);
  } catch (error) {
    next(error)
  }
};

exports.readAll = async (res, model, next) => {
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
    return res.send(data);
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, model, next) => {
  try {
    const {data} = req;
    const { id } = req;
    if (!id) throw createError.BadRequest('id is required in the url');

    const doesItemExist = await model.exists({ _id: id });

    if (!doesItemExist)
      throw createError.BadRequest(
        `${model.modelName.slice(0, -1)} do not exist`
      );

    const { modifiedCount } = await model.updateOne({ _id: id }, data, { runValidators: true });
    if (modifiedCount === 0) throw createError.Conflict('duplicate data');
    return res.send({_id:id, ...data});
  } catch (error) {
    next(error);
  }
};
