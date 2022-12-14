import joi from 'joi'

const gameSchema = joi.object({

    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().greater(1).required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().greater(1).required(),

})

export default gameSchema