const { assert } = require('chai');

const getErrors = (validation, expected) => {
    assert.isDefined(validation, 'expected validation errors but got none');
    const { errors } = validation;
    assert.isDefined(errors);
    if(expected !== undefined) { /* eslint-disable-line */
        assert.equal(Object.keys(errors).length, expected);
    }
    return errors;
};

module.exports = { getErrors };