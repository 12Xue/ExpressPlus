/**
 * 12XueSSO
 *  Created by usher.yue.
 * User: usher.yue
 * Date: 17/1/9
 * Time: 17:18
 */

module.exports = {
    _type: 'select',
    _lastCondition: '',
    _select: '',
    _from: '',
    _where: '',
    _insert: '',
    _join: '',
    _groupBy: '',
    _orderBy: '',
    _update: '',
    _delete: '',
    _limit: '',
    _set: '',
    _isArray: function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    _clear: function () {
        this._type = 'select';
        this._lastCondition = '';
        this._select = '';
        this._from = '';
        this._insert = '';
        this._join = '';
        this._groupBy = '';
        this._orderBy = '';
        this._update = '';
        this._delete = '';
        this._set = '';
        this._orderBy = '';
        this._limit = '';
    },
    insertInto: function (tableName, values) {
        this._clear();
        this._insert = this._insert.concat('insert into ', tableName, ' ');
        let $this = this;
        let valList = '';
        let fileds = '';
        if ($this._isArray(values) && values.length > 0) {
            fileds = Object.keys(values[0]).map(function (val) {
                return '`' + val + '`';
            }).join(',');
            valList = values.map(function (val) {
                return '(' + Object.values(val).map(function (val) {
                    if (val.toString().indexOf("fn:") >= 0) {
                        var temp = val.toString().split(':');
                        val = temp[1];
                        return val;
                    } else {
                        return '\'' + val + '\'';
                    }
                }).join(',') + ')';
            }).join(',');
        } else {
            fileds = Object.keys(values).map(function (val) {
                return '`' + val + '`';
            }).join(',');
            valList = '(' + Object.values(values).map(function (val) {
                if (val && val.toString().indexOf("fn:") >= 0) {
                    var temp = val.toString().split(':');
                    val = temp[1];
                    return val;
                } else {
                    return '\'' + val + '\'';
                }
            }).join(',') + ')';
        }
        this._insert = this._insert.concat('(' + fileds + ')', ' VALUES ', valList);
        this._type = 'insert';
        return this;
    },
    replaceInto: function (tableName, values) {
        this._clear();
        this._insert = this._insert.concat('replace into ', tableName, ' ');
        let $this = this;
        let valList = '';
        let fileds = '';
        if ($this._isArray(values) && values.length > 0) {
            fileds = Object.keys(values[0]).map(function (val) {
                return '`' + val + '`';
            }).join(',');
            valList = values.map(function (val) {
                return '(' + Object.values(val).map(function (val) {
                    return '`' + val + '`';
                }).join(',') + ')';
            }).join(',')
        } else {
            fileds = Object.keys(values).map(function (val) {
                return '`' + val + '`';
            }).join(',');
            valList = Object.values(values).map(function (val) {
                return '\'' + val + '\'';
            });
        }
        this._insert = this._insert.concat('(' + fileds + ')', ' VALUES(', valList, ')');
        this._type = 'insert';
        return this;
    },
    delete: function () {
        this._clear();
        if (arguments.length == 0) {
            console.log('miss select fields...');
        } else if (arguments.length == 1) {
            let argType = typeof(arguments[0]);
            switch (argType) {
                case 'string': {
                    this._delete = 'delete from  ' + arguments[0] + ' ';
                    break;
                }
                case 'object': {
                    let args = arguments[0];
                    this._delete = 'delete from ' + args.join(',') + ' ';
                    break;
                }
            }
        } else {
            let args = Object.values(arguments);
            this._delete = 'delete from ' + args.join(',') + ' ';
        }
        this._type = 'delete';
        return this;
    },
    asc: function () {
        this._orderBy += " asc";
        return this;
    },
    desc: function () {
        this._orderBy += " desc";
        return this;
    },
    limit: function () {
        var displaynum = '0';
        if (arguments.length > 2) {
            console.log('limit argument too long!');
        }
        if (arguments.length == 0) {
            displaynum = '10';
        }
        else if (arguments.length == 1) {
            this._limit += ' limit' + ' ' + arguments[0];
            return this;
        }
        else if (arguments.length == 2) {
            this._limit += ' limit' + ' ' + arguments[0] + ',' + arguments[1];
            return this;
        }
        this._limit += ' limit' + ' ' + displaynum;
        return this;
    },
    select: function () {
        this._clear();
        if (arguments.length == 0) {
            console.log('miss select fields...');
        } else if (arguments.length == 1) {
            let argType = typeof(arguments[0]);
            switch (argType) {
                case 'string': {
                    this._select = 'select  ' + arguments[0] + ' ';
                    break;
                }
                case 'object': {
                    let args = arguments[0].map(function (value) {
                        if (value.indexOf('as') != -1) {
                            return value;
                        } else {
                            return '' + value + '';
                        }
                    });
                    this._select = 'select ' + args.join(',') + ' ';
                    break;
                }
            }
        } else {
            let args = Object.values(arguments).map(function (value) {
                if (value.indexOf('as') != -1) {
                    return value;
                } else {
                    return '`' + value + '`';
                }
            });
            this._select = 'select ' + args.join(',') + ' ';
        }
        this._type = 'select';
        return this;
    },
    update: function (tableName) {
        this._clear();
        if (arguments.length == 0) {
            console.log('miss update table...');
        } else if (arguments.length == 1) {
            let argType = typeof(arguments[0]);
            switch (argType) {
                case 'string': {
                    this._update = 'update ' + arguments[0] + ' ';
                    break;
                }
                case 'object': {
                    this._update = 'update ' + arguments[0].join(',') + ' ';
                    break;
                }
            }
        } else {
            let args = Object.values(arguments);
            this._update = 'update ' + args.join(',') + ' ';
        }
        this._type = 'update';
        return this;
    },
    set: function () {
        if (arguments.length == 0) {
            console.log('miss set variables...');
        } else if (arguments.length == 1) {
            if (typeof(arguments[0]) == 'string') {
                this._set = ' set ' + arguments[0] + ' ';
            } else {
                let setArray = [];
                for (var key in arguments[0]) {
                    if (typeof(arguments[0][key]) == 'string' && arguments[0][key].search(/[\+\-\*/]/ig) != -1) {
                        setArray.push(' `' + key + '`=' + arguments[0][key] + ' ');
                    } else {
                        setArray.push(' `' + key + '`=\'' + arguments[0][key] + '\'');
                    }
                }
                this._set = ' set ' + setArray.join(',') + ' ';
            }
        } else {
            let setArray = Object.values(arguments);
            this._set = ' set ' + setArray.join(',') + ' ';
        }
        return this;
    },
    _parseCondition: function (arguments) {
        if (arguments.length == 0) {
            return '';
        } else if (arguments.length == 1) {
            let firstPrm = arguments[0]
            if (typeof(firstPrm) == 'string') {
                return '  (' + firstPrm + ') ';
            } else {
                let whereArray = [];
                for (var key in firstPrm) {
                    let safeKey = (key.indexOf(".") == -1) ? key : key.split('.').map(function (v, i, arr) {
                        return (i == 0) ? v : '`' + v + '`';
                    }).join('.');
                    if (firstPrm[key] instanceof Object) {
                        if (firstPrm[key].length && firstPrm[key][0] instanceof Object) {
                            firstPrm[key].forEach(function (current, index, arr) {
                                switch (current[0].toLowerCase()) {
                                    case 'in': {
                                        whereArray.push('`' + safeKey + '` in' + '('.concat(current[1].map(function (v, i, arr) {
                                            return '\''.concat(v).concat('\'');
                                        }).join(',').concat(')')));
                                        break;
                                    }
                                    case 'between': {
                                        whereArray.push(safeKey + ' between \'' + current[1] + '\' and \'' + current[2] + '\'');
                                        break;
                                    }
                                    case 'like': {
                                        whereArray.push(safeKey + ' like \'' + current[1] + '\'');
                                        break;
                                    }
                                    default: {
                                        whereArray.push(safeKey + ' ' + current[0] + ' \'' + current[1] + '\'');
                                    }
                                }
                            });
                        } else {
                            switch (firstPrm[key][0].toLowerCase()) {
                                case 'in': {
                                    whereArray.push(safeKey + ' in' + '('.concat(firstPrm[key][1].map(function (current, index, arr) {
                                        return '\''.concat(current).concat('\'');
                                    }).join(',').concat(')')));
                                    break;
                                }
                                case 'between': {
                                    whereArray.push(safeKey + ' between \'' + firstPrm[key][1] + '\' and \'' + firstPrm[key][2] + '\'');
                                    break;
                                }
                                case 'like': {
                                    whereArray.push(safeKey + ' like \'' + firstPrm[key][1] + '\'');
                                    break;
                                }
                                default: {
                                    whereArray.push(safeKey + firstPrm[key][0] + ' \'' + firstPrm[key][1] + '\'');
                                }
                            }
                        }
                    } else {
                        if (typeof(firstPrm[key]) == 'string' && firstPrm[key].search(/[<>=]/ig) != -1) {
                            whereArray.push(safeKey + firstPrm[key] + ' ');
                        } else {
                            whereArray.push(safeKey + '=\'' + firstPrm[key] + '\'');
                        }
                    }
                }
                return '  (' + whereArray.join(' and ') + ') ';
            }
        } else {
            let setArray = Object.values(arguments);
            return '  (' + setArray.join(' and ') + ') ';
        }
    },
    where: function () {
        this._where = ' where ' + this._parseCondition(arguments);
        this._lastCondition = 'where';
        return this;
    },
    and: function () {
        let parseCondition = this._parseCondition(arguments);
        if (this._lastCondition == 'where') {
            this._where += ' and ' + parseCondition;
        } else if (this._lastCondition == 'on') {
            this._join += ' and ' + parseCondition;
        } else if (this._lastCondition == 'having') {
            this._groupBy += ' and ' + parseCondition;
        }
        return this;
    },
    or: function () {
        let parseCondition = this._parseCondition(arguments);
        if (this._lastCondition == 'where') {
            this._where += ' or ' + parseCondition;
        } else if (this._lastCondition == 'on') {
            this._join += ' or ' + parseCondition;
        } else if (this._lastCondition == 'having') {
            this._groupBy += ' or ' + parseCondition;
        }
        return this;
    },
    leftJoin: function (tableName) {
        this._join += ' left join ' + tableName;
        return this;
    },
    innerJoin: function (tableName) {
        this._join += '  join ' + tableName;
        return this;
    },
    rightJoin: function (tableName) {
        this._join += ' right join ' + tableName;
        return this;
    },
    fullJoin: function (tableName) {
        this._join += ' full join ' + tableName;
        return this;
    },
    on: function (condition) {
        this._join += ' on ' + condition;
        this._lastCondition = 'on';
        return this;
    },
    from: function () {
        if (arguments.length == 0) {
            console.log('miss select table...');
        } else if (arguments.length == 1) {
            let argType = typeof(arguments[0]);
            switch (argType) {
                case 'string': {
                    this._from = 'from ' + arguments[0] + ' ';
                    break;
                }
                case 'object': {
                    this._from = 'from ' + arguments[0].join(',') + ' ';
                    break;
                }
            }
        } else {
            this._from = 'from ' + Object.values(arguments).join(',') + ' ';
        }
        return this;
    },
    fromSubquery: function (subquery, alias) {
        let subSql = 'from (';
        if (typeof(subquery) == 'object') {
            subSql += subquery.sql();
        } else if (typeof(subquery) == 'string') {
            subSql += subquery;
        }
        subSql = subSql.concat(") as", alias);
        this._from = subSql;
        return this;
    },
    groupBy: function (confition) {
        this._groupBy += ' group by ' + confition;
        return this;
    },
    having: function (confition) {
        this._groupBy += ' having ' + confition;
        this._lastCondition = 'having';
        return this;
    },
    orderBy: function (condition) {
        this._orderBy += ' order by ' + condition
        return this;
    },
    sql: function () {
        switch (this._type) {
            case 'select': {
                return this._select.concat(this._from, this._join, this._where, this._groupBy, this._orderBy, this._limit);
            }
            case 'update': {
                return this._update.concat(this._set, this._where);
            }
            case 'delete': {
                return this._delete.concat(this._where);
            }
            case 'insert': {
                return this._insert;
            }
        }
    }

};