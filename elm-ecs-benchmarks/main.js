(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.cD.ch === region.cY.ch)
	{
		return 'on line ' + region.cD.ch;
	}
	return 'on lines ' + region.cD.ch + ' through ' + region.cY.ch;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ek,
		impl.ec,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		a$: func(record.a$),
		cE: record.cE,
		cp: record.cp
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.a$;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.cE;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.cp) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ek,
		impl.ec,
		function(sendToApp, initialModel) {
			var view = impl.em;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dZ,
		impl.ek,
		impl.ec,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.cw && impl.cw(sendToApp)
			var view = impl.em;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.dN);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.ee) && (_VirtualDom_doc.title = title = doc.ee);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.d5;
	var onUrlRequest = impl.d6;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		cw: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.dn === next.dn
							&& curr.c2 === next.c2
							&& curr.dj.a === next.dj.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dZ: function(flags)
		{
			return A3(impl.dZ, flags, _Browser_getUrl(), key);
		},
		em: impl.em,
		ek: impl.ek,
		ec: impl.ec
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dX: 'hidden', dP: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dX: 'mozHidden', dP: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dX: 'msHidden', dP: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dX: 'webkitHidden', dP: 'webkitvisibilitychange' }
		: { dX: 'hidden', dP: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		du: _Browser_getScene(),
		dE: {
			cI: _Browser_window.pageXOffset,
			cK: _Browser_window.pageYOffset,
			dH: _Browser_doc.documentElement.clientWidth,
			c1: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		dH: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		c1: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			du: {
				dH: node.scrollWidth,
				c1: node.scrollHeight
			},
			dE: {
				cI: node.scrollLeft,
				cK: node.scrollTop,
				dH: node.clientWidth,
				c1: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			du: _Browser_getScene(),
			dE: {
				cI: x,
				cK: y,
				dH: _Browser_doc.documentElement.clientWidth,
				c1: _Browser_doc.documentElement.clientHeight
			},
			dS: {
				cI: x + rect.left,
				cK: y + rect.top,
				dH: rect.width,
				c1: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.aB) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.aC),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.aC);
		} else {
			var treeLen = builder.aB * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.aD) : builder.aD;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.aB);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.aC) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.aC);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{aD: nodeList, aB: (len / $elm$core$Array$branchFactor) | 0, aC: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {c0: fragment, c2: host, dh: path, dj: port_, dn: protocol, $7: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$document = _Browser_document;
var $author$project$Main$ElmEcs = 0;
var $author$project$Main$Idle = {$: 0};
var $author$project$Main$Iterate1 = 0;
var $author$project$Main$LoopUpdate = 0;
var $author$project$Main$entityCounts = _Utils_Tuple2(
	1000,
	_List_fromArray(
		[2000, 4000, 8000, 16000, 32000, 64000]));
var $turboMaCk$non_empty_list_alias$List$NonEmpty$head = function (_v0) {
	var h = _v0.a;
	return h;
};
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$updateCounts = _Utils_Tuple2(
	500,
	_List_fromArray(
		[1000, 2000]));
var $author$project$Main$init = function (_v0) {
	return _Utils_Tuple2(
		{
			aL: {by: 0, aG: $author$project$Main$Idle},
			aI: {
				bk: $elm$core$Maybe$Nothing,
				bK: _List_Nil,
				a8: _List_Nil,
				a9: 0,
				bz: $turboMaCk$non_empty_list_alias$List$NonEmpty$head($author$project$Main$entityCounts),
				ba: 0,
				bA: $turboMaCk$non_empty_list_alias$List$NonEmpty$head($author$project$Main$updateCounts),
				bb: 0
			}
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Main$BenchmarkEnded = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$BenchmarkFailed = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$BenchmarkInit = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$BenchmarkUpdate = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Main$benchmarkEnded = _Platform_incomingPort(
	'benchmarkEnded',
	A2(
		$elm$json$Json$Decode$andThen,
		function (samples) {
			return $elm$json$Json$Decode$succeed(
				{cu: samples});
		},
		A2(
			$elm$json$Json$Decode$field,
			'samples',
			$elm$json$Json$Decode$list(
				A2(
					$elm$json$Json$Decode$andThen,
					function (usedHeapSize) {
						return A2(
							$elm$json$Json$Decode$andThen,
							function (totalHeapSize) {
								return A2(
									$elm$json$Json$Decode$andThen,
									function (index) {
										return A2(
											$elm$json$Json$Decode$andThen,
											function (dt) {
												return $elm$json$Json$Decode$succeed(
													{bI: dt, bl: index, bP: totalHeapSize, bS: usedHeapSize});
											},
											A2($elm$json$Json$Decode$field, 'dt', $elm$json$Json$Decode$float));
									},
									A2($elm$json$Json$Decode$field, 'index', $elm$json$Json$Decode$int));
							},
							A2($elm$json$Json$Decode$field, 'totalHeapSize', $elm$json$Json$Decode$int));
					},
					A2($elm$json$Json$Decode$field, 'usedHeapSize', $elm$json$Json$Decode$int))))));
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Main$benchmarkFailed = _Platform_incomingPort('benchmarkFailed', $elm$json$Json$Decode$string);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $author$project$Main$initBenchmark = _Platform_incomingPort(
	'initBenchmark',
	$elm$json$Json$Decode$null(0));
var $author$project$Main$updateBenchmark = _Platform_incomingPort(
	'updateBenchmark',
	$elm$json$Json$Decode$null(0));
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				$author$project$Main$initBenchmark($author$project$Main$BenchmarkInit),
				$author$project$Main$updateBenchmark($author$project$Main$BenchmarkUpdate),
				$author$project$Main$benchmarkEnded($author$project$Main$BenchmarkEnded),
				$author$project$Main$benchmarkFailed($author$project$Main$BenchmarkFailed)
			]));
};
var $author$project$Main$ErrorMessage = $elm$core$Basics$identity;
var $author$project$Main$Initializing = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$Running = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $author$project$Main$benchmarkTypeToString = function (benchmarkType) {
	switch (benchmarkType) {
		case 0:
			return 'Iterate1';
		case 1:
			return 'Iterate2';
		case 2:
			return 'Iterate3';
		case 3:
			return 'Update1';
		case 4:
			return 'Update2';
		default:
			return 'Update3';
	}
};
var $author$project$Main$Iterate2 = 1;
var $author$project$Main$Iterate3 = 2;
var $author$project$Main$Update1 = 3;
var $author$project$Main$Update2 = 4;
var $author$project$Main$Update3 = 5;
var $author$project$Main$benchmarkTypes = _Utils_Tuple2(
	0,
	_List_fromArray(
		[1, 2, 3, 4, 5]));
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $turboMaCk$non_empty_list_alias$List$NonEmpty$toList = function (_v0) {
	var h = _v0.a;
	var t = _v0.b;
	return A2($elm$core$List$cons, h, t);
};
var $author$project$Main$fromString = F3(
	function (toString, values, stringValue) {
		return $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (value) {
					return _Utils_eq(
						stringValue,
						toString(value));
				},
				$turboMaCk$non_empty_list_alias$List$NonEmpty$toList(values)));
	});
var $author$project$Main$benchmarkTypeFromString = A2($author$project$Main$fromString, $author$project$Main$benchmarkTypeToString, $author$project$Main$benchmarkTypes);
var $author$project$Main$ecsFrameworkToString = function (ecsFramework) {
	switch (ecsFramework) {
		case 0:
			return 'ElmEcs';
		case 1:
			return 'ElmGameLogic';
		case 2:
			return 'JsEcsy';
		default:
			return 'JsHyperrEcs';
	}
};
var $author$project$Main$ElmGameLogic = 1;
var $author$project$Main$JsEcsy = 2;
var $author$project$Main$JsHyperrEcs = 3;
var $author$project$Main$ecsFrameworks = _Utils_Tuple2(
	0,
	_List_fromArray(
		[1, 2, 3]));
var $author$project$Main$ecsFrameworkFromString = A2($author$project$Main$fromString, $author$project$Main$ecsFrameworkToString, $author$project$Main$ecsFrameworks);
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Main$updateTypeToString = function (updateType) {
	switch (updateType) {
		case 0:
			return 'LoopUpdate';
		case 1:
			return 'TimerUpdate';
		default:
			return 'AnimationFrameUpdate';
	}
};
var $author$project$Main$encodeProperties = function (properties) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'id',
				$elm$json$Json$Encode$int(properties.a3)),
				_Utils_Tuple2(
				'type',
				$elm$json$Json$Encode$string(
					$author$project$Main$benchmarkTypeToString(properties.bq))),
				_Utils_Tuple2(
				'framework',
				$elm$json$Json$Encode$string(
					$author$project$Main$ecsFrameworkToString(properties.bx))),
				_Utils_Tuple2(
				'entityCount',
				$elm$json$Json$Encode$int(properties.dU)),
				_Utils_Tuple2(
				'updateCount',
				$elm$json$Json$Encode$int(properties.bQ)),
				_Utils_Tuple2(
				'updateType',
				$elm$json$Json$Encode$string(
					$author$project$Main$updateTypeToString(properties.bR)))
			]));
};
var $author$project$Main$entityCountToString = function (entityCount) {
	return $elm$core$String$fromInt(entityCount) + ' entities';
};
var $author$project$Main$entityCountFromString = A2($author$project$Main$fromString, $author$project$Main$entityCountToString, $author$project$Main$entityCounts);
var $author$project$Main$ElmEcsIterate1 = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$ElmEcsIterate2 = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$ElmEcsIterate3 = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$ElmEcsUpdate1 = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$ElmEcsUpdate2 = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$ElmEcsUpdate3 = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$ElmGameLogicIterate1 = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$ElmGameLogicIterate2 = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$ElmGameLogicIterate3 = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$ElmGameLogicUpdate1 = function (a) {
	return {$: 9, a: a};
};
var $author$project$Main$ElmGameLogicUpdate2 = function (a) {
	return {$: 10, a: a};
};
var $author$project$Main$ElmGameLogicUpdate3 = function (a) {
	return {$: 11, a: a};
};
var $author$project$Main$ExternalModel = {$: 12};
var $harmboschloo$elm_ecs$Ecs$Internal$World = $elm$core$Basics$identity;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $harmboschloo$elm_ecs$Ecs$emptyWorld = F2(
	function (_v0, singletons) {
		var componentsSpec = _v0;
		return {ac: $elm$core$Maybe$Nothing, cT: componentsSpec.dT, ap: $elm$core$Set$empty, ar: singletons};
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $harmboschloo$elm_ecs$Ecs$insertComponent = F3(
	function (_v0, a, _v1) {
		var spec = _v0;
		var world = _v1;
		var _v2 = world.ac;
		if (!_v2.$) {
			var entityId = _v2.a;
			return {
				ac: world.ac,
				cT: A2(
					spec.bn,
					A3(
						$elm$core$Dict$insert,
						entityId,
						a,
						spec.aR(world.cT)),
					world.cT),
				ap: world.ap,
				ar: world.ar
			};
		} else {
			return world;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $harmboschloo$elm_ecs$Ecs$insertEntity = F2(
	function (entityId, _v0) {
		var entities = _v0.ap;
		var components = _v0.cT;
		var singletons = _v0.ar;
		return {
			ac: $elm$core$Maybe$Just(entityId),
			cT: components,
			ap: A2($elm$core$Set$insert, entityId, entities),
			ar: singletons
		};
	});
var $author$project$ElmEcs$Specs = F4(
	function (components, componentA, componentB, componentC) {
		return {aP: componentA, a_: componentB, bu: componentC, cT: components};
	});
var $harmboschloo$elm_ecs$Ecs$Internal$AllComponentsSpec = $elm$core$Basics$identity;
var $harmboschloo$elm_ecs$Ecs$Internal$ComponentSpec = $elm$core$Basics$identity;
var $harmboschloo$elm_ecs$Ecs$Components3$Components3 = $elm$core$Basics$identity;
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $harmboschloo$elm_ecs$Ecs$Components3$specs = function (fn) {
	return A4(
		fn,
		{
			cQ: F2(
				function (entityId, _v0) {
					var components = _v0;
					return {
						bi: A2($elm$core$Dict$remove, entityId, components.bi),
						ah: A2($elm$core$Dict$remove, entityId, components.ah),
						ai: A2($elm$core$Dict$remove, entityId, components.ai)
					};
				}),
			dT: {bi: $elm$core$Dict$empty, ah: $elm$core$Dict$empty, ai: $elm$core$Dict$empty},
			eb: function (_v1) {
				var components = _v1;
				return ($elm$core$Dict$size(components.bi) + $elm$core$Dict$size(components.ah)) + $elm$core$Dict$size(components.ai);
			}
		},
		{
			aR: function (_v2) {
				var components = _v2;
				return components.bi;
			},
			bn: F2(
				function (dict, _v3) {
					var components = _v3;
					return {bi: dict, ah: components.ah, ai: components.ai};
				})
		},
		{
			aR: function (_v4) {
				var components = _v4;
				return components.ah;
			},
			bn: F2(
				function (dict, _v5) {
					var components = _v5;
					return {bi: components.bi, ah: dict, ai: components.ai};
				})
		},
		{
			aR: function (_v6) {
				var components = _v6;
				return components.ai;
			},
			bn: F2(
				function (dict, _v7) {
					var components = _v7;
					return {bi: components.bi, ah: components.ah, ai: dict};
				})
		});
};
var $author$project$ElmEcs$specs = $harmboschloo$elm_ecs$Ecs$Components3$specs($author$project$ElmEcs$Specs);
var $author$project$ElmEcs$initWorld3 = function (_v0) {
	var entityCount = _v0.dU;
	return A3(
		$elm$core$List$foldl,
		F2(
			function (id, world) {
				return A3(
					$harmboschloo$elm_ecs$Ecs$insertComponent,
					$author$project$ElmEcs$specs.bu,
					{bF: 1, bG: 2, bH: false},
					A3(
						$harmboschloo$elm_ecs$Ecs$insertComponent,
						$author$project$ElmEcs$specs.a_,
						{bg: 1, bh: 2},
						A3(
							$harmboschloo$elm_ecs$Ecs$insertComponent,
							$author$project$ElmEcs$specs.aP,
							{aX: 1},
							A2($harmboschloo$elm_ecs$Ecs$insertEntity, id, world))));
			}),
		A2($harmboschloo$elm_ecs$Ecs$emptyWorld, $author$project$ElmEcs$specs.cT, 0),
		A2($elm$core$List$range, 1, entityCount));
};
var $author$project$ElmEcs$initIterate1 = $author$project$ElmEcs$initWorld3;
var $justgook$elm_game_logic$Logic$Component$Spec = F2(
	function (get, set) {
		return {aR: get, bn: set};
	});
var $author$project$ElmGameLogic$aSpecWorld3 = A2(
	$justgook$elm_game_logic$Logic$Component$Spec,
	function ($) {
		return $.aK;
	},
	F2(
		function (a, w) {
			return {aK: a, aO: w.aO, aU: w.aU};
		}));
var $author$project$ElmGameLogic$bSpecWorld3 = A2(
	$justgook$elm_game_logic$Logic$Component$Spec,
	function ($) {
		return $.aO;
	},
	F2(
		function (b, w) {
			return {aK: w.aK, aO: b, aU: w.aU};
		}));
var $author$project$ElmGameLogic$cSpecWorld3 = A2(
	$justgook$elm_game_logic$Logic$Component$Spec,
	function ($) {
		return $.aU;
	},
	F2(
		function (c, w) {
			return {aK: w.aK, aO: w.aO, aU: c};
		}));
var $justgook$elm_game_logic$Logic$Entity$create = F2(
	function (id, world) {
		return _Utils_Tuple2(id, world);
	});
var $justgook$elm_game_logic$Logic$Component$empty = $elm$core$Array$empty;
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.aC)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.aC, tail);
		return (notAppended < 0) ? {
			aD: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.aD),
			aB: builder.aB + 1,
			aC: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			aD: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.aD),
			aB: builder.aB + 1,
			aC: $elm$core$Elm$JsArray$empty
		} : {aD: builder.aD, aB: builder.aB, aC: appended});
	});
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		aD: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		aB: (len / $elm$core$Array$branchFactor) | 0,
		aC: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $justgook$elm_game_logic$Logic$Component$spawn = F3(
	function (id, value, components) {
		return ((id - $elm$core$Array$length(components)) < 0) ? A3(
			$elm$core$Array$set,
			id,
			$elm$core$Maybe$Just(value),
			components) : A2(
			$elm$core$Array$push,
			$elm$core$Maybe$Just(value),
			A2(
				$elm$core$Array$append,
				components,
				A2(
					$elm$core$Array$repeat,
					id - $elm$core$Array$length(components),
					$elm$core$Maybe$Nothing)));
	});
var $justgook$elm_game_logic$Logic$Entity$with = F2(
	function (_v0, _v1) {
		var spec = _v0.a;
		var component = _v0.b;
		var entityID = _v1.a;
		var world = _v1.b;
		var updatedComponents = A3(
			$justgook$elm_game_logic$Logic$Component$spawn,
			entityID,
			component,
			spec.aR(world));
		var updatedWorld = A2(spec.bn, updatedComponents, world);
		return _Utils_Tuple2(entityID, updatedWorld);
	});
var $author$project$ElmGameLogic$initWorld3 = function (_v0) {
	var entityCount = _v0.dU;
	return A3(
		$elm$core$List$foldl,
		F2(
			function (id, world) {
				return A2(
					$justgook$elm_game_logic$Logic$Entity$with,
					_Utils_Tuple2(
						$author$project$ElmGameLogic$cSpecWorld3,
						{bF: 1, bG: 2, bH: false}),
					A2(
						$justgook$elm_game_logic$Logic$Entity$with,
						_Utils_Tuple2(
							$author$project$ElmGameLogic$bSpecWorld3,
							{bg: 1, bh: 2}),
						A2(
							$justgook$elm_game_logic$Logic$Entity$with,
							_Utils_Tuple2(
								$author$project$ElmGameLogic$aSpecWorld3,
								{aX: 1}),
							A2($justgook$elm_game_logic$Logic$Entity$create, id, world)))).b;
			}),
		{aK: $justgook$elm_game_logic$Logic$Component$empty, aO: $justgook$elm_game_logic$Logic$Component$empty, aU: $justgook$elm_game_logic$Logic$Component$empty},
		A2($elm$core$List$range, 1, entityCount));
};
var $author$project$ElmGameLogic$initIterate1 = $author$project$ElmGameLogic$initWorld3;
var $author$project$ElmEcs$initIterate2 = $author$project$ElmEcs$initWorld3;
var $author$project$ElmGameLogic$initIterate2 = $author$project$ElmGameLogic$initWorld3;
var $author$project$ElmEcs$initIterate3 = $author$project$ElmEcs$initWorld3;
var $author$project$ElmGameLogic$initIterate3 = $author$project$ElmGameLogic$initWorld3;
var $author$project$ElmEcs$initUpdate1 = $author$project$ElmEcs$initWorld3;
var $author$project$ElmGameLogic$initUpdate1 = $author$project$ElmGameLogic$initWorld3;
var $author$project$ElmEcs$initUpdate2 = $author$project$ElmEcs$initWorld3;
var $author$project$ElmGameLogic$initUpdate2 = $author$project$ElmGameLogic$initWorld3;
var $author$project$ElmEcs$initUpdate3 = $author$project$ElmEcs$initWorld3;
var $author$project$ElmGameLogic$initUpdate3 = $author$project$ElmGameLogic$initWorld3;
var $author$project$Main$initEcs = function (properties) {
	var _v0 = properties.bx;
	switch (_v0) {
		case 0:
			var _v1 = properties.bq;
			switch (_v1) {
				case 0:
					return $author$project$Main$ElmEcsIterate1(
						$author$project$ElmEcs$initIterate1(properties));
				case 1:
					return $author$project$Main$ElmEcsIterate2(
						$author$project$ElmEcs$initIterate2(properties));
				case 2:
					return $author$project$Main$ElmEcsIterate3(
						$author$project$ElmEcs$initIterate3(properties));
				case 3:
					return $author$project$Main$ElmEcsUpdate1(
						$author$project$ElmEcs$initUpdate1(properties));
				case 4:
					return $author$project$Main$ElmEcsUpdate2(
						$author$project$ElmEcs$initUpdate2(properties));
				default:
					return $author$project$Main$ElmEcsUpdate3(
						$author$project$ElmEcs$initUpdate3(properties));
			}
		case 1:
			var _v2 = properties.bq;
			switch (_v2) {
				case 0:
					return $author$project$Main$ElmGameLogicIterate1(
						$author$project$ElmGameLogic$initIterate1(properties));
				case 1:
					return $author$project$Main$ElmGameLogicIterate2(
						$author$project$ElmGameLogic$initIterate2(properties));
				case 2:
					return $author$project$Main$ElmGameLogicIterate3(
						$author$project$ElmGameLogic$initIterate3(properties));
				case 3:
					return $author$project$Main$ElmGameLogicUpdate1(
						$author$project$ElmGameLogic$initUpdate1(properties));
				case 4:
					return $author$project$Main$ElmGameLogicUpdate2(
						$author$project$ElmGameLogic$initUpdate2(properties));
				default:
					return $author$project$Main$ElmGameLogicUpdate3(
						$author$project$ElmGameLogic$initUpdate3(properties));
			}
		case 2:
			return $author$project$Main$ExternalModel;
		default:
			return $author$project$Main$ExternalModel;
	}
};
var $author$project$Main$runBenchmark = _Platform_outgoingPort('runBenchmark', $elm$core$Basics$identity);
var $author$project$Main$updateCountToString = function (updateCount) {
	return $elm$core$String$fromInt(updateCount) + 'x';
};
var $author$project$Main$updateCountFromString = A2($author$project$Main$fromString, $author$project$Main$updateCountToString, $author$project$Main$updateCounts);
var $author$project$ElmEcs$applyIterate1 = F3(
	function (_v0, _v1, world) {
		return world;
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft = F4(
	function (_v0, fn, acc, _v1) {
		var spec = _v0;
		var world = _v1;
		return A3(
			$elm$core$Dict$foldl,
			fn,
			acc,
			spec.aR(world.cT));
	});
var $author$project$ElmEcs$updateIterate1 = function (world) {
	return A4($harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$applyIterate1, world, world);
};
var $author$project$ElmGameLogic$applyIterate1 = F2(
	function (_v0, world) {
		return world;
	});
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $justgook$elm_game_logic$Logic$System$foldl = F3(
	function (f, comp1, acc_) {
		return A3(
			$elm$core$Array$foldl,
			F2(
				function (value, acc) {
					return A2(
						$elm$core$Maybe$withDefault,
						acc,
						A2(
							$elm$core$Maybe$map,
							function (a) {
								return A2(f, a, acc);
							},
							value));
				}),
			acc_,
			comp1);
	});
var $author$project$ElmGameLogic$updateIterate1 = function (world) {
	return A3($justgook$elm_game_logic$Logic$System$foldl, $author$project$ElmGameLogic$applyIterate1, world.aK, world);
};
var $author$project$ElmEcs$applyIterate2 = F4(
	function (_v0, _v1, _v2, world) {
		return world;
	});
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $harmboschloo$elm_dict_intersect$Dict$Intersect$Internal$fold2 = F5(
	function (foldFn, fn, acc, dict1, dict2) {
		return A3(
			foldFn,
			F3(
				function (k, v1, acc_) {
					var _v0 = A2($elm$core$Dict$get, k, dict2);
					if (!_v0.$) {
						var v2 = _v0.a;
						return A4(fn, k, v1, v2, acc_);
					} else {
						return acc_;
					}
				}),
			acc,
			dict1);
	});
var $harmboschloo$elm_dict_intersect$Dict$Intersect$foldl2 = $harmboschloo$elm_dict_intersect$Dict$Intersect$Internal$fold2($elm$core$Dict$foldl);
var $harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft2 = F5(
	function (_v0, _v1, fn, acc, _v2) {
		var spec1 = _v0;
		var spec2 = _v1;
		var world = _v2;
		return A4(
			$harmboschloo$elm_dict_intersect$Dict$Intersect$foldl2,
			fn,
			acc,
			spec1.aR(world.cT),
			spec2.aR(world.cT));
	});
var $author$project$ElmEcs$updateIterate2 = function (world) {
	return A5($harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft2, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$specs.a_, $author$project$ElmEcs$applyIterate2, world, world);
};
var $author$project$ElmGameLogic$applyIterate2 = F3(
	function (_v0, _v1, world) {
		return world;
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $justgook$elm_game_logic$Logic$Component$get = function (id) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$Array$get(id),
		$elm$core$Maybe$withDefault($elm$core$Maybe$Nothing));
};
var $justgook$elm_game_logic$Logic$Internal$indexedFoldlArray = F3(
	function (func, acc, list) {
		var step = F2(
			function (x, _v0) {
				var i = _v0.a;
				var thisAcc = _v0.b;
				return _Utils_Tuple2(
					i + 1,
					A3(func, i, x, thisAcc));
			});
		return A3(
			$elm$core$Array$foldl,
			step,
			_Utils_Tuple2(0, acc),
			list).b;
	});
var $elm$core$Maybe$map2 = F3(
	function (func, ma, mb) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				return $elm$core$Maybe$Just(
					A2(func, a, b));
			}
		}
	});
var $justgook$elm_game_logic$Logic$System$foldl2 = F4(
	function (f, comp1, comp2, acc_) {
		return A3(
			$justgook$elm_game_logic$Logic$Internal$indexedFoldlArray,
			F3(
				function (n, value, acc) {
					return A2(
						$elm$core$Maybe$withDefault,
						acc,
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (a, b) {
									return A3(f, a, b, acc);
								}),
							value,
							A2($justgook$elm_game_logic$Logic$Component$get, n, comp2)));
				}),
			acc_,
			comp1);
	});
var $author$project$ElmGameLogic$updateIterate2 = function (world) {
	return A4($justgook$elm_game_logic$Logic$System$foldl2, $author$project$ElmGameLogic$applyIterate2, world.aK, world.aO, world);
};
var $author$project$ElmEcs$applyIterate3 = F5(
	function (_v0, _v1, _v2, _v3, world) {
		return world;
	});
var $harmboschloo$elm_dict_intersect$Dict$Intersect$Internal$fold3 = F6(
	function (foldFn, fn, acc, dict1, dict2, dict3) {
		return A3(
			foldFn,
			F3(
				function (k, v1, acc_) {
					var _v0 = A2($elm$core$Dict$get, k, dict2);
					if (!_v0.$) {
						var v2 = _v0.a;
						var _v1 = A2($elm$core$Dict$get, k, dict3);
						if (!_v1.$) {
							var v3 = _v1.a;
							return A5(fn, k, v1, v2, v3, acc_);
						} else {
							return acc_;
						}
					} else {
						return acc_;
					}
				}),
			acc,
			dict1);
	});
var $harmboschloo$elm_dict_intersect$Dict$Intersect$foldl3 = $harmboschloo$elm_dict_intersect$Dict$Intersect$Internal$fold3($elm$core$Dict$foldl);
var $harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft3 = F6(
	function (_v0, _v1, _v2, fn, acc, _v3) {
		var spec1 = _v0;
		var spec2 = _v1;
		var spec3 = _v2;
		var world = _v3;
		return A5(
			$harmboschloo$elm_dict_intersect$Dict$Intersect$foldl3,
			fn,
			acc,
			spec1.aR(world.cT),
			spec2.aR(world.cT),
			spec3.aR(world.cT));
	});
var $author$project$ElmEcs$updateIterate3 = function (world) {
	return A6($harmboschloo$elm_ecs$Ecs$EntityComponents$foldFromLeft3, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$specs.a_, $author$project$ElmEcs$specs.bu, $author$project$ElmEcs$applyIterate3, world, world);
};
var $author$project$ElmGameLogic$applyIterate3 = F4(
	function (_v0, _v1, _v2, world) {
		return world;
	});
var $elm$core$Maybe$map3 = F4(
	function (func, ma, mb, mc) {
		if (ma.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var a = ma.a;
			if (mb.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var b = mb.a;
				if (mc.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var c = mc.a;
					return $elm$core$Maybe$Just(
						A3(func, a, b, c));
				}
			}
		}
	});
var $justgook$elm_game_logic$Logic$System$foldl3 = F5(
	function (f, comp1, comp2, comp3, acc_) {
		return A3(
			$justgook$elm_game_logic$Logic$Internal$indexedFoldlArray,
			F3(
				function (n, value, acc) {
					return A2(
						$elm$core$Maybe$withDefault,
						acc,
						A4(
							$elm$core$Maybe$map3,
							F3(
								function (a, b, c) {
									return A4(f, a, b, c, acc);
								}),
							value,
							A2($justgook$elm_game_logic$Logic$Component$get, n, comp2),
							A2($justgook$elm_game_logic$Logic$Component$get, n, comp3)));
				}),
			acc_,
			comp1);
	});
var $author$project$ElmGameLogic$updateIterate3 = function (world) {
	return A5($justgook$elm_game_logic$Logic$System$foldl3, $author$project$ElmGameLogic$applyIterate3, world.aK, world.aO, world.aU, world);
};
var $author$project$ElmEcs$applyUpdate1 = F3(
	function (_v0, a, world) {
		return A3(
			$harmboschloo$elm_ecs$Ecs$insertComponent,
			$author$project$ElmEcs$specs.aP,
			{aX: a.aX + 1},
			world);
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn = F4(
	function (fn, entityId, a, _v0) {
		var world = _v0;
		return A3(
			fn,
			entityId,
			a,
			{
				ac: $elm$core$Maybe$Just(entityId),
				cT: world.cT,
				ap: world.ap,
				ar: world.ar
			});
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft = F3(
	function (_v0, fn, _v1) {
		var spec = _v0;
		var world = _v1;
		return A3(
			$elm$core$Dict$foldl,
			$harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn(fn),
			world,
			spec.aR(world.cT));
	});
var $author$project$ElmEcs$updateUpdate1 = function (world) {
	return A3($harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$applyUpdate1, world);
};
var $author$project$ElmGameLogic$applyUpdate1 = function (a) {
	return {aX: a.aX + 1};
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $justgook$elm_game_logic$Logic$System$step = F3(
	function (f, _v0, world) {
		var get = _v0.aR;
		var set = _v0.bn;
		return A2(
			set,
			A2(
				$elm$core$Array$map,
				$elm$core$Maybe$map(f),
				get(world)),
			world);
	});
var $author$project$ElmGameLogic$updateUpdate1 = function (world) {
	return A3($justgook$elm_game_logic$Logic$System$step, $author$project$ElmGameLogic$applyUpdate1, $author$project$ElmGameLogic$aSpecWorld3, world);
};
var $author$project$ElmEcs$applyUpdate2 = F4(
	function (_v0, a, b, world) {
		return A3(
			$harmboschloo$elm_ecs$Ecs$insertComponent,
			$author$project$ElmEcs$specs.a_,
			{bg: b.bg + 1, bh: b.bh - 1},
			A3(
				$harmboschloo$elm_ecs$Ecs$insertComponent,
				$author$project$ElmEcs$specs.aP,
				{aX: a.aX + 1},
				world));
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn2 = F5(
	function (fn, entityId, a1, a2, _v0) {
		var world = _v0;
		return A4(
			fn,
			entityId,
			a1,
			a2,
			{
				ac: $elm$core$Maybe$Just(entityId),
				cT: world.cT,
				ap: world.ap,
				ar: world.ar
			});
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft2 = F4(
	function (_v0, _v1, fn, _v2) {
		var spec1 = _v0;
		var spec2 = _v1;
		var world = _v2;
		return A4(
			$harmboschloo$elm_dict_intersect$Dict$Intersect$foldl2,
			$harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn2(fn),
			world,
			spec1.aR(world.cT),
			spec2.aR(world.cT));
	});
var $author$project$ElmEcs$updateUpdate2 = function (world) {
	return A4($harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft2, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$specs.a_, $author$project$ElmEcs$applyUpdate2, world);
};
var $author$project$ElmGameLogic$applyUpdate2 = F3(
	function (_v0, _v1, world) {
		var a = _v0.a;
		var setA = _v0.b;
		var b = _v1.a;
		var setB = _v1.b;
		return A2(
			setB,
			{bg: b.bg + 1, bh: b.bh - 1},
			A2(
				setA,
				{aX: a.aX + 1},
				world));
	});
var $justgook$elm_game_logic$Logic$System$applyIf = F3(
	function (bool, f, world) {
		return bool ? f(world) : world;
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $justgook$elm_game_logic$Logic$System$step2 = F4(
	function (f, spec1, spec2, world) {
		var set2 = F3(
			function (i, b, acc) {
				return _Utils_update(
					acc,
					{
						aO: A3(
							$elm$core$Array$set,
							i,
							$elm$core$Maybe$Just(b),
							acc.aO)
					});
			});
		var set1 = F3(
			function (i, a, acc) {
				return _Utils_update(
					acc,
					{
						aK: A3(
							$elm$core$Array$set,
							i,
							$elm$core$Maybe$Just(a),
							acc.aK)
					});
			});
		var combined = {
			aK: spec1.aR(world),
			aO: spec2.aR(world)
		};
		var result = A3(
			$justgook$elm_game_logic$Logic$Internal$indexedFoldlArray,
			F3(
				function (n, value, acc) {
					return A2(
						$elm$core$Maybe$withDefault,
						acc,
						A3(
							$elm$core$Maybe$map2,
							F2(
								function (a, b) {
									return A3(
										f,
										_Utils_Tuple2(
											a,
											set1(n)),
										_Utils_Tuple2(
											b,
											set2(n)),
										acc);
								}),
							value,
							A2($justgook$elm_game_logic$Logic$Component$get, n, acc.aO)));
				}),
			combined,
			combined.aK);
		return A3(
			$justgook$elm_game_logic$Logic$System$applyIf,
			!_Utils_eq(result.aO, combined.aO),
			spec2.bn(result.aO),
			A3(
				$justgook$elm_game_logic$Logic$System$applyIf,
				!_Utils_eq(result.aK, combined.aK),
				spec1.bn(result.aK),
				world));
	});
var $author$project$ElmGameLogic$updateUpdate2 = function (world) {
	return A4($justgook$elm_game_logic$Logic$System$step2, $author$project$ElmGameLogic$applyUpdate2, $author$project$ElmGameLogic$aSpecWorld3, $author$project$ElmGameLogic$bSpecWorld3, world);
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$ElmEcs$applyUpdate3 = F5(
	function (_v0, a, b, c, world) {
		return A3(
			$harmboschloo$elm_ecs$Ecs$insertComponent,
			$author$project$ElmEcs$specs.bu,
			{bF: c.bF + 1, bG: c.bG - 1, bH: !c.bH},
			A3(
				$harmboschloo$elm_ecs$Ecs$insertComponent,
				$author$project$ElmEcs$specs.a_,
				{bg: b.bg + 1, bh: b.bh - 1},
				A3(
					$harmboschloo$elm_ecs$Ecs$insertComponent,
					$author$project$ElmEcs$specs.aP,
					{aX: a.aX + 1},
					world)));
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn3 = F6(
	function (fn, entityId, a1, a2, a3, _v0) {
		var world = _v0;
		return A5(
			fn,
			entityId,
			a1,
			a2,
			a3,
			{
				ac: $elm$core$Maybe$Just(entityId),
				cT: world.cT,
				ap: world.ap,
				ar: world.ar
			});
	});
var $harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft3 = F5(
	function (_v0, _v1, _v2, fn, _v3) {
		var spec1 = _v0;
		var spec2 = _v1;
		var spec3 = _v2;
		var world = _v3;
		return A5(
			$harmboschloo$elm_dict_intersect$Dict$Intersect$foldl3,
			$harmboschloo$elm_ecs$Ecs$EntityComponents$entityFn3(fn),
			world,
			spec1.aR(world.cT),
			spec2.aR(world.cT),
			spec3.aR(world.cT));
	});
var $author$project$ElmEcs$updateUpdate3 = function (world) {
	return A5($harmboschloo$elm_ecs$Ecs$EntityComponents$processFromLeft3, $author$project$ElmEcs$specs.aP, $author$project$ElmEcs$specs.a_, $author$project$ElmEcs$specs.bu, $author$project$ElmEcs$applyUpdate3, world);
};
var $author$project$ElmGameLogic$applyUpdate3 = F4(
	function (_v0, _v1, _v2, world) {
		var a = _v0.a;
		var setA = _v0.b;
		var b = _v1.a;
		var setB = _v1.b;
		var c = _v2.a;
		var setC = _v2.b;
		return A2(
			setC,
			{bF: c.bF + 1, bG: c.bG - 1, bH: !c.bH},
			A2(
				setB,
				{bg: b.bg + 1, bh: b.bh - 1},
				A2(
					setA,
					{aX: a.aX + 1},
					world)));
	});
var $justgook$elm_game_logic$Logic$System$step3 = F5(
	function (f, spec1, spec2, spec3, world) {
		var set3 = F3(
			function (i, c, acc) {
				return _Utils_update(
					acc,
					{
						aU: A3(
							$elm$core$Array$set,
							i,
							$elm$core$Maybe$Just(c),
							acc.aU)
					});
			});
		var set2 = F3(
			function (i, b, acc) {
				return _Utils_update(
					acc,
					{
						aO: A3(
							$elm$core$Array$set,
							i,
							$elm$core$Maybe$Just(b),
							acc.aO)
					});
			});
		var set1 = F3(
			function (i, a, acc) {
				return _Utils_update(
					acc,
					{
						aK: A3(
							$elm$core$Array$set,
							i,
							$elm$core$Maybe$Just(a),
							acc.aK)
					});
			});
		var combined = {
			aK: spec1.aR(world),
			aO: spec2.aR(world),
			aU: spec3.aR(world)
		};
		var result = A3(
			$justgook$elm_game_logic$Logic$Internal$indexedFoldlArray,
			F3(
				function (n, value, acc) {
					return A2(
						$elm$core$Maybe$withDefault,
						acc,
						A4(
							$elm$core$Maybe$map3,
							F3(
								function (a, b, c) {
									return A4(
										f,
										_Utils_Tuple2(
											a,
											set1(n)),
										_Utils_Tuple2(
											b,
											set2(n)),
										_Utils_Tuple2(
											c,
											set3(n)),
										acc);
								}),
							value,
							A2($justgook$elm_game_logic$Logic$Component$get, n, acc.aO),
							A2($justgook$elm_game_logic$Logic$Component$get, n, acc.aU)));
				}),
			combined,
			combined.aK);
		return A3(
			$justgook$elm_game_logic$Logic$System$applyIf,
			!_Utils_eq(result.aU, combined.aU),
			spec3.bn(result.aU),
			A3(
				$justgook$elm_game_logic$Logic$System$applyIf,
				!_Utils_eq(result.aO, combined.aO),
				spec2.bn(result.aO),
				A3(
					$justgook$elm_game_logic$Logic$System$applyIf,
					!_Utils_eq(result.aK, combined.aK),
					spec1.bn(result.aK),
					world)));
	});
var $author$project$ElmGameLogic$updateUpdate3 = function (world) {
	return A5($justgook$elm_game_logic$Logic$System$step3, $author$project$ElmGameLogic$applyUpdate3, $author$project$ElmGameLogic$aSpecWorld3, $author$project$ElmGameLogic$bSpecWorld3, $author$project$ElmGameLogic$cSpecWorld3, world);
};
var $author$project$Main$updateEcs = F2(
	function (_v0, ecsModel) {
		switch (ecsModel.$) {
			case 0:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsIterate1(
					$author$project$ElmEcs$updateIterate1(world));
			case 1:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsIterate2(
					$author$project$ElmEcs$updateIterate2(world));
			case 2:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsIterate3(
					$author$project$ElmEcs$updateIterate3(world));
			case 3:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsUpdate1(
					$author$project$ElmEcs$updateUpdate1(world));
			case 4:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsUpdate2(
					$author$project$ElmEcs$updateUpdate2(world));
			case 5:
				var world = ecsModel.a;
				return $author$project$Main$ElmEcsUpdate3(
					$author$project$ElmEcs$updateUpdate3(world));
			case 6:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicIterate1(
					$author$project$ElmGameLogic$updateIterate1(world));
			case 7:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicIterate2(
					$author$project$ElmGameLogic$updateIterate2(world));
			case 8:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicIterate3(
					$author$project$ElmGameLogic$updateIterate3(world));
			case 9:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicUpdate1(
					$author$project$ElmGameLogic$updateUpdate1(world));
			case 10:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicUpdate2(
					$author$project$ElmGameLogic$updateUpdate2(world));
			case 11:
				var world = ecsModel.a;
				return $author$project$Main$ElmGameLogicUpdate3(
					$author$project$ElmGameLogic$updateUpdate3(world));
			default:
				return $author$project$Main$ExternalModel;
		}
	});
var $author$project$Main$updateInput = F4(
	function (valueFromString, updateUi, stringValue, model) {
		var _v0 = model.aL.aG;
		if (!_v0.$) {
			var _v1 = valueFromString(stringValue);
			if (!_v1.$) {
				var value = _v1.a;
				var ui = A2(updateUi, value, model.aI);
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aI: _Utils_update(
								ui,
								{bk: $elm$core$Maybe$Nothing})
						}),
					$elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$AnimationFrameUpdate = 2;
var $author$project$Main$TimerUpdate = 1;
var $author$project$Main$updateTypes = _Utils_Tuple2(
	0,
	_List_fromArray(
		[1, 2]));
var $author$project$Main$updateTypeFromString = A2($author$project$Main$fromString, $author$project$Main$updateTypeToString, $author$project$Main$updateTypes);
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = model;
		var ui = _v0.aI;
		var benchmark = _v0.aL;
		switch (msg.$) {
			case 0:
				var _v2 = benchmark.aG;
				if (_v2.$ === 1) {
					var properties = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aL: _Utils_update(
									benchmark,
									{
										aG: A2(
											$author$project$Main$Running,
											properties,
											$author$project$Main$initEcs(properties))
									})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 1:
				var _v3 = model.aL.aG;
				if (_v3.$ === 2) {
					var properties = _v3.a;
					var ecsModel = _v3.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aL: _Utils_update(
									benchmark,
									{
										aG: A2(
											$author$project$Main$Running,
											properties,
											A2($author$project$Main$updateEcs, properties, ecsModel))
									})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 2:
				var data = msg.a;
				var _v4 = model.aL.aG;
				if (_v4.$ === 2) {
					var properties = _v4.a;
					return _Utils_Tuple2(
						{
							aL: _Utils_update(
								benchmark,
								{aG: $author$project$Main$Idle}),
							aI: _Utils_update(
								ui,
								{
									a8: _Utils_ap(
										model.aI.a8,
										_List_fromArray(
											[
												{bX: data, bw: true, bm: properties}
											]))
								})
						},
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 3:
				var message = msg.a;
				return _Utils_Tuple2(
					{
						aL: _Utils_update(
							benchmark,
							{aG: $author$project$Main$Idle}),
						aI: _Utils_update(
							ui,
							{
								bk: $elm$core$Maybe$Just(message)
							})
					},
					$elm$core$Platform$Cmd$none);
			case 4:
				var string = msg.a;
				return A4(
					$author$project$Main$updateInput,
					$author$project$Main$benchmarkTypeFromString,
					F2(
						function (value, m) {
							return _Utils_update(
								m,
								{a9: value});
						}),
					string,
					model);
			case 5:
				var string = msg.a;
				return A4(
					$author$project$Main$updateInput,
					$author$project$Main$ecsFrameworkFromString,
					F2(
						function (value, m) {
							return _Utils_update(
								m,
								{ba: value});
						}),
					string,
					model);
			case 6:
				var string = msg.a;
				return A4(
					$author$project$Main$updateInput,
					$author$project$Main$entityCountFromString,
					F2(
						function (value, m) {
							return _Utils_update(
								m,
								{bz: value});
						}),
					string,
					model);
			case 7:
				var string = msg.a;
				return A4(
					$author$project$Main$updateInput,
					$author$project$Main$updateCountFromString,
					F2(
						function (value, m) {
							return _Utils_update(
								m,
								{bA: value});
						}),
					string,
					model);
			case 8:
				var string = msg.a;
				return A4(
					$author$project$Main$updateInput,
					$author$project$Main$updateTypeFromString,
					F2(
						function (value, m) {
							return _Utils_update(
								m,
								{bb: value});
						}),
					string,
					model);
			case 9:
				var _v5 = benchmark.aG;
				if (!_v5.$) {
					var properties = {dU: ui.bz, bx: ui.ba, a3: benchmark.by, bq: ui.a9, bQ: ui.bA, bR: ui.bb};
					return _Utils_Tuple2(
						{
							aL: {
								by: benchmark.by + 1,
								aG: $author$project$Main$Initializing(properties)
							},
							aI: _Utils_update(
								ui,
								{bk: $elm$core$Maybe$Nothing})
						},
						$author$project$Main$runBenchmark(
							$author$project$Main$encodeProperties(properties)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 10:
				var benchmarkId = msg.a;
				var enabled = msg.b;
				var _v6 = benchmark.aG;
				if (!_v6.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aI: _Utils_update(
									ui,
									{
										a8: A2(
											$elm$core$List$map,
											function (result) {
												return _Utils_eq(result.bm.a3, benchmarkId) ? _Utils_update(
													result,
													{bw: enabled}) : result;
											},
											ui.a8)
									})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			default:
				var hinted = msg.a;
				var _v7 = benchmark.aG;
				if (!_v7.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aI: _Utils_update(
									ui,
									{bK: hinted})
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$lazy = _VirtualDom_lazy;
var $elm$html$Html$Lazy$lazy = $elm$virtual_dom$VirtualDom$lazy;
var $elm$virtual_dom$VirtualDom$lazy2 = _VirtualDom_lazy2;
var $elm$html$Html$Lazy$lazy2 = $elm$virtual_dom$VirtualDom$lazy2;
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Main$ChangedBenchmarkType = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$ChangedEcsFramework = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$ChangedEntityCount = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$ChangedUpdateCount = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$ChangedUpdateType = function (a) {
	return {$: 8, a: a};
};
var $author$project$Main$PressedRun = {$: 9};
var $author$project$Main$benchmarkTypeDescription = function (benchmarkType) {
	switch (benchmarkType) {
		case 0:
			return 'All entities have 3 components a b c. Iterate over all entities with a.';
		case 1:
			return 'All entities have 3 components a b c. Iterate over all entities with a & b.';
		case 2:
			return 'All entities have 3 components a b c. Iterate over all entities with a & b & c.';
		case 3:
			return 'All entities have 3 components a b c. Iterate over all entities with a and update a.';
		case 4:
			return 'All entities have 3 components a b c. Iterate over all entities with a & b and update a & b.';
		default:
			return 'All entities have 3 components a b c. Iterate over all entities with a & b & c and update a & b & c.';
	}
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$dd = _VirtualDom_node('dd');
var $elm$html$Html$dl = _VirtualDom_node('dl');
var $elm$html$Html$dt = _VirtualDom_node('dt');
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $author$project$Main$ecsFrameworkDescription = function (ecsFramework) {
	switch (ecsFramework) {
		case 0:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('https://package.elm-lang.org/packages/harmboschloo/elm-ecs/latest/')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('harmboschloo/elm-ecs')
					]));
		case 1:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('https://package.elm-lang.org/packages/justgook/elm-game-logic/latest/')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('justgook/elm-game-logic')
					]));
		case 2:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('https://ecsy.io/')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('https://ecsy.io/')
					]));
		default:
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href('https://github.com/gohyperr/hyperr-ecs')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('https://github.com/gohyperr/hyperr-ecs')
					]));
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$i = _VirtualDom_node('i');
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Main$updateTypeDescription = function (updateType) {
	switch (updateType) {
		case 0:
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('All updates withing one '),
						A2(
						$elm$html$Html$i,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('for')
							])),
						$elm$html$Html$text(' loop.')
					]));
		case 1:
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('One update per '),
						A2(
						$elm$html$Html$i,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('setTimeout')
							])),
						$elm$html$Html$text(' callback, as fast as possible.')
					]));
		default:
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('One update per '),
						A2(
						$elm$html$Html$i,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('requestAnimationFrame')
							])),
						$elm$html$Html$text(' callback.')
					]));
	}
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewSelect = F4(
	function (toMsg, toString, selected, values) {
		return A2(
			$elm$html$Html$select,
			_List_fromArray(
				[
					$elm$html$Html$Events$onInput(toMsg)
				]),
			A2(
				$elm$core$List$map,
				function (value) {
					var stringValue = toString(value);
					return A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(stringValue),
								$elm$html$Html$Attributes$selected(
								_Utils_eq(value, selected))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(stringValue)
							]));
				},
				$turboMaCk$non_empty_list_alias$List$NonEmpty$toList(values)));
	});
var $author$project$Main$viewInputs = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A4($author$project$Main$viewSelect, $author$project$Main$ChangedBenchmarkType, $author$project$Main$benchmarkTypeToString, model.a9, $author$project$Main$benchmarkTypes),
				$elm$html$Html$text(' '),
				A4($author$project$Main$viewSelect, $author$project$Main$ChangedEcsFramework, $author$project$Main$ecsFrameworkToString, model.ba, $author$project$Main$ecsFrameworks),
				$elm$html$Html$text(' '),
				A4($author$project$Main$viewSelect, $author$project$Main$ChangedEntityCount, $author$project$Main$entityCountToString, model.bz, $author$project$Main$entityCounts),
				$elm$html$Html$text(' '),
				A4($author$project$Main$viewSelect, $author$project$Main$ChangedUpdateCount, $author$project$Main$updateCountToString, model.bA, $author$project$Main$updateCounts),
				$elm$html$Html$text(' '),
				A4($author$project$Main$viewSelect, $author$project$Main$ChangedUpdateType, $author$project$Main$updateTypeToString, model.bb, $author$project$Main$updateTypes),
				$elm$html$Html$text(' '),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$PressedRun)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('run')
					])),
				function () {
				var _v0 = model.bk;
				if (!_v0.$) {
					var message = _v0.a;
					return A2(
						$elm$html$Html$h3,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', '#f00')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(message)
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				A2(
				$elm$html$Html$dl,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$dt,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$benchmarkTypeToString(model.a9))
							])),
						A2(
						$elm$html$Html$dd,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$benchmarkTypeDescription(model.a9))
							])),
						A2(
						$elm$html$Html$dt,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$ecsFrameworkToString(model.ba))
							])),
						A2(
						$elm$html$Html$dd,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Main$ecsFrameworkDescription(model.ba)
							])),
						A2(
						$elm$html$Html$dt,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Main$updateTypeToString(model.bb))
							])),
						A2(
						$elm$html$Html$dd,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Main$updateTypeDescription(model.bb)
							]))
					]))
			]));
};
var $avh4$elm_color$Color$RgbaSpace = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $avh4$elm_color$Color$scaleFrom255 = function (c) {
	return c / 255;
};
var $avh4$elm_color$Color$rgb255 = F3(
	function (r, g, b) {
		return A4(
			$avh4$elm_color$Color$RgbaSpace,
			$avh4$elm_color$Color$scaleFrom255(r),
			$avh4$elm_color$Color$scaleFrom255(g),
			$avh4$elm_color$Color$scaleFrom255(b),
			1.0);
	});
var $terezka$line_charts$LineChart$Colors$black = A3($avh4$elm_color$Color$rgb255, 0, 0, 0);
var $terezka$line_charts$LineChart$Colors$blue = A3($avh4$elm_color$Color$rgb255, 3, 169, 244);
var $terezka$line_charts$LineChart$Colors$blueLight = A3($avh4$elm_color$Color$rgb255, 128, 222, 234);
var $terezka$line_charts$LineChart$Colors$cyan = A3($avh4$elm_color$Color$rgb255, 0, 229, 255);
var $terezka$line_charts$LineChart$Colors$cyanLight = A3($avh4$elm_color$Color$rgb255, 128, 222, 234);
var $terezka$line_charts$LineChart$Colors$gold = A3($avh4$elm_color$Color$rgb255, 205, 145, 60);
var $terezka$line_charts$LineChart$Colors$goldLight = A3($avh4$elm_color$Color$rgb255, 255, 204, 128);
var $terezka$line_charts$LineChart$Colors$gray = A3($avh4$elm_color$Color$rgb255, 163, 163, 163);
var $terezka$line_charts$LineChart$Colors$grayLight = A3($avh4$elm_color$Color$rgb255, 211, 211, 211);
var $terezka$line_charts$LineChart$Colors$grayLightest = A3($avh4$elm_color$Color$rgb255, 243, 243, 243);
var $terezka$line_charts$LineChart$Colors$green = A3($avh4$elm_color$Color$rgb255, 67, 160, 71);
var $terezka$line_charts$LineChart$Colors$greenLight = A3($avh4$elm_color$Color$rgb255, 197, 225, 165);
var $terezka$line_charts$LineChart$Colors$pink = A3($avh4$elm_color$Color$rgb255, 245, 105, 215);
var $terezka$line_charts$LineChart$Colors$pinkLight = A3($avh4$elm_color$Color$rgb255, 244, 143, 177);
var $terezka$line_charts$LineChart$Colors$purple = A3($avh4$elm_color$Color$rgb255, 156, 39, 176);
var $terezka$line_charts$LineChart$Colors$purpleLight = A3($avh4$elm_color$Color$rgb255, 206, 147, 216);
var $terezka$line_charts$LineChart$Colors$red = A3($avh4$elm_color$Color$rgb255, 216, 27, 96);
var $terezka$line_charts$LineChart$Colors$redLight = A3($avh4$elm_color$Color$rgb255, 239, 154, 154);
var $terezka$line_charts$LineChart$Colors$rust = A3($avh4$elm_color$Color$rgb255, 205, 102, 51);
var $terezka$line_charts$LineChart$Colors$strongBlue = A3($avh4$elm_color$Color$rgb255, 89, 51, 204);
var $terezka$line_charts$LineChart$Colors$teal = A3($avh4$elm_color$Color$rgb255, 29, 233, 182);
var $terezka$line_charts$LineChart$Colors$tealLight = A3($avh4$elm_color$Color$rgb255, 128, 203, 196);
var $author$project$Main$colors = _List_fromArray(
	[$terezka$line_charts$LineChart$Colors$pink, $terezka$line_charts$LineChart$Colors$blue, $terezka$line_charts$LineChart$Colors$gold, $terezka$line_charts$LineChart$Colors$red, $terezka$line_charts$LineChart$Colors$green, $terezka$line_charts$LineChart$Colors$cyan, $terezka$line_charts$LineChart$Colors$teal, $terezka$line_charts$LineChart$Colors$purple, $terezka$line_charts$LineChart$Colors$rust, $terezka$line_charts$LineChart$Colors$strongBlue, $terezka$line_charts$LineChart$Colors$pinkLight, $terezka$line_charts$LineChart$Colors$blueLight, $terezka$line_charts$LineChart$Colors$goldLight, $terezka$line_charts$LineChart$Colors$redLight, $terezka$line_charts$LineChart$Colors$greenLight, $terezka$line_charts$LineChart$Colors$cyanLight, $terezka$line_charts$LineChart$Colors$tealLight, $terezka$line_charts$LineChart$Colors$purpleLight, $terezka$line_charts$LineChart$Colors$black, $terezka$line_charts$LineChart$Colors$gray, $terezka$line_charts$LineChart$Colors$grayLight, $terezka$line_charts$LineChart$Colors$grayLightest]);
var $author$project$Main$Hinted = function (a) {
	return {$: 11, a: a};
};
var $terezka$line_charts$LineChart$Container$Margin = F4(
	function (top, right, bottom, left) {
		return {dO: bottom, da: left, ea: right, dC: top};
	});
var $terezka$line_charts$Internal$Container$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Container$custom = $elm$core$Basics$identity;
var $terezka$line_charts$LineChart$Container$custom = $terezka$line_charts$Internal$Container$custom;
var $terezka$line_charts$Internal$Container$Relative = 1;
var $terezka$line_charts$Internal$Container$relative = 1;
var $terezka$line_charts$LineChart$Container$relative = $terezka$line_charts$Internal$Container$relative;
var $author$project$Main$containerConfig = function (id) {
	return $terezka$line_charts$LineChart$Container$custom(
		{
			dL: _List_Nil,
			dM: _List_Nil,
			a3: id,
			d2: A4($terezka$line_charts$LineChart$Container$Margin, 30, 400, 30, 100),
			eb: $terezka$line_charts$LineChart$Container$relative
		});
};
var $terezka$line_charts$Internal$Area$None = {$: 0};
var $terezka$line_charts$Internal$Area$none = $terezka$line_charts$Internal$Area$None;
var $terezka$line_charts$LineChart$Area$default = $terezka$line_charts$Internal$Area$none;
var $terezka$line_charts$Internal$Axis$Values$Around = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Axis$Values$around = $terezka$line_charts$Internal$Axis$Values$Around;
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $terezka$line_charts$Internal$Axis$Title$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Title$custom = F4(
	function (position, x, y, title) {
		return {
			M: _Utils_Tuple2(x, y),
			bO: position,
			em: title
		};
	});
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$style = _VirtualDom_attribute('style');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$tspan = $elm$svg$Svg$trustedNode('tspan');
var $terezka$line_charts$Internal$Svg$label = F2(
	function (color, string) {
		return A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$fill(color),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$tspan,
					_List_Nil,
					_List_fromArray(
						[
							$elm$svg$Svg$text(string)
						]))
				]));
	});
var $terezka$line_charts$Internal$Axis$Title$atPosition = F3(
	function (position, x, y) {
		return A2(
			$elm$core$Basics$composeL,
			A3($terezka$line_charts$Internal$Axis$Title$custom, position, x, y),
			$terezka$line_charts$Internal$Svg$label('inherit'));
	});
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $terezka$line_charts$Internal$Axis$Title$atDataMax = function () {
	var position = F2(
		function (data, range) {
			return A2($elm$core$Basics$min, data.bL, range.bL);
		});
	return $terezka$line_charts$Internal$Axis$Title$atPosition(position);
}();
var $terezka$line_charts$Internal$Axis$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Ticks$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Ticks$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Values$ceilingTo = F2(
	function (prec, number) {
		return prec * $elm$core$Basics$ceiling(number / prec);
	});
var $elm$core$Basics$round = _Basics_round;
var $terezka$line_charts$Internal$Axis$Values$getBeginning = F2(
	function (min, interval) {
		var multiple = min / interval;
		return _Utils_eq(
			multiple,
			$elm$core$Basics$round(multiple)) ? min : A2($terezka$line_charts$Internal$Axis$Values$ceilingTo, interval, min);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $myrho$elm_round$Round$addSign = F2(
	function (signed, str) {
		var isNotZero = A2(
			$elm$core$List$any,
			function (c) {
				return (c !== '0') && (c !== '.');
			},
			$elm$core$String$toList(str));
		return _Utils_ap(
			(signed && isNotZero) ? '-' : '',
			str);
	});
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$core$String$cons = _String_cons;
var $elm$core$Char$fromCode = _Char_fromCode;
var $myrho$elm_round$Round$increaseNum = function (_v0) {
	var head = _v0.a;
	var tail = _v0.b;
	if (head === '9') {
		var _v1 = $elm$core$String$uncons(tail);
		if (_v1.$ === 1) {
			return '01';
		} else {
			var headtail = _v1.a;
			return A2(
				$elm$core$String$cons,
				'0',
				$myrho$elm_round$Round$increaseNum(headtail));
		}
	} else {
		var c = $elm$core$Char$toCode(head);
		return ((c >= 48) && (c < 57)) ? A2(
			$elm$core$String$cons,
			$elm$core$Char$fromCode(c + 1),
			tail) : '0';
	}
};
var $elm$core$Basics$isInfinite = _Basics_isInfinite;
var $elm$core$Basics$isNaN = _Basics_isNaN;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padRight = F3(
	function (n, _char, string) {
		return _Utils_ap(
			string,
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)));
	});
var $elm$core$String$reverse = _String_reverse;
var $myrho$elm_round$Round$splitComma = function (str) {
	var _v0 = A2($elm$core$String$split, '.', str);
	if (_v0.b) {
		if (_v0.b.b) {
			var before = _v0.a;
			var _v1 = _v0.b;
			var after = _v1.a;
			return _Utils_Tuple2(before, after);
		} else {
			var before = _v0.a;
			return _Utils_Tuple2(before, '0');
		}
	} else {
		return _Utils_Tuple2('0', '0');
	}
};
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $myrho$elm_round$Round$toDecimal = function (fl) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(
			$elm$core$Basics$abs(fl)));
	if (_v0.b) {
		if (_v0.b.b) {
			var num = _v0.a;
			var _v1 = _v0.b;
			var exp = _v1.a;
			var e = A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(
					A2($elm$core$String$startsWith, '+', exp) ? A2($elm$core$String$dropLeft, 1, exp) : exp));
			var _v2 = $myrho$elm_round$Round$splitComma(num);
			var before = _v2.a;
			var after = _v2.b;
			var total = _Utils_ap(before, after);
			var zeroed = (e < 0) ? A2(
				$elm$core$Maybe$withDefault,
				'0',
				A2(
					$elm$core$Maybe$map,
					function (_v3) {
						var a = _v3.a;
						var b = _v3.b;
						return a + ('.' + b);
					},
					A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$mapFirst($elm$core$String$fromChar),
						$elm$core$String$uncons(
							_Utils_ap(
								A2(
									$elm$core$String$repeat,
									$elm$core$Basics$abs(e),
									'0'),
								total))))) : A3($elm$core$String$padRight, e + 1, '0', total);
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				zeroed);
		} else {
			var num = _v0.a;
			return _Utils_ap(
				(fl < 0) ? '-' : '',
				num);
		}
	} else {
		return '';
	}
};
var $myrho$elm_round$Round$roundFun = F3(
	function (functor, s, fl) {
		if ($elm$core$Basics$isInfinite(fl) || $elm$core$Basics$isNaN(fl)) {
			return $elm$core$String$fromFloat(fl);
		} else {
			var signed = fl < 0;
			var _v0 = $myrho$elm_round$Round$splitComma(
				$myrho$elm_round$Round$toDecimal(
					$elm$core$Basics$abs(fl)));
			var before = _v0.a;
			var after = _v0.b;
			var r = $elm$core$String$length(before) + s;
			var normalized = _Utils_ap(
				A2($elm$core$String$repeat, (-r) + 1, '0'),
				A3(
					$elm$core$String$padRight,
					r,
					'0',
					_Utils_ap(before, after)));
			var totalLen = $elm$core$String$length(normalized);
			var roundDigitIndex = A2($elm$core$Basics$max, 1, r);
			var increase = A2(
				functor,
				signed,
				A3($elm$core$String$slice, roundDigitIndex, totalLen, normalized));
			var remains = A3($elm$core$String$slice, 0, roundDigitIndex, normalized);
			var num = increase ? $elm$core$String$reverse(
				A2(
					$elm$core$Maybe$withDefault,
					'1',
					A2(
						$elm$core$Maybe$map,
						$myrho$elm_round$Round$increaseNum,
						$elm$core$String$uncons(
							$elm$core$String$reverse(remains))))) : remains;
			var numLen = $elm$core$String$length(num);
			var numZeroed = (num === '0') ? num : ((s <= 0) ? _Utils_ap(
				num,
				A2(
					$elm$core$String$repeat,
					$elm$core$Basics$abs(s),
					'0')) : ((_Utils_cmp(
				s,
				$elm$core$String$length(after)) < 0) ? (A3($elm$core$String$slice, 0, numLen - s, num) + ('.' + A3($elm$core$String$slice, numLen - s, numLen, num))) : _Utils_ap(
				before + '.',
				A3($elm$core$String$padRight, s, '0', after))));
			return A2($myrho$elm_round$Round$addSign, signed, numZeroed);
		}
	});
var $myrho$elm_round$Round$round = $myrho$elm_round$Round$roundFun(
	F2(
		function (signed, str) {
			var _v0 = $elm$core$String$uncons(str);
			if (_v0.$ === 1) {
				return false;
			} else {
				if ('5' === _v0.a.a) {
					if (_v0.a.b === '') {
						var _v1 = _v0.a;
						return !signed;
					} else {
						var _v2 = _v0.a;
						return true;
					}
				} else {
					var _v3 = _v0.a;
					var _int = _v3.a;
					return function (i) {
						return ((i > 53) && signed) || ((i >= 53) && (!signed));
					}(
						$elm$core$Char$toCode(_int));
				}
			}
		}));
var $elm$core$String$toFloat = _String_toFloat;
var $terezka$line_charts$Internal$Axis$Values$correctFloat = function (prec) {
	return A2(
		$elm$core$Basics$composeR,
		$myrho$elm_round$Round$round(prec),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$toFloat,
			$elm$core$Maybe$withDefault(0)));
};
var $terezka$line_charts$Internal$Axis$Values$getMultiples = F3(
	function (magnitude, allowDecimals, hasTickAmount) {
		var defaults = hasTickAmount ? _List_fromArray(
			[1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]) : _List_fromArray(
			[1, 2, 2.5, 5, 10]);
		return allowDecimals ? defaults : ((magnitude === 1) ? A2(
			$elm$core$List$filter,
			function (n) {
				return _Utils_eq(
					$elm$core$Basics$round(n),
					n);
			},
			defaults) : ((magnitude <= 0.1) ? _List_fromArray(
			[1 / magnitude]) : defaults));
	});
var $terezka$line_charts$Internal$Axis$Values$getPrecision = function (number) {
	var _v0 = A2(
		$elm$core$String$split,
		'e',
		$elm$core$String$fromFloat(number));
	if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
		var before = _v0.a;
		var _v1 = _v0.b;
		var after = _v1.a;
		return $elm$core$Basics$abs(
			A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(after)));
	} else {
		var _v2 = A2(
			$elm$core$String$split,
			'.',
			$elm$core$String$fromFloat(number));
		if ((_v2.b && _v2.b.b) && (!_v2.b.b.b)) {
			var before = _v2.a;
			var _v3 = _v2.b;
			var after = _v3.a;
			return $elm$core$String$length(after);
		} else {
			return 0;
		}
	}
};
var $elm$core$Basics$e = _Basics_e;
var $elm$core$Basics$pow = _Basics_pow;
var $terezka$line_charts$Internal$Utils$magnitude = function (num) {
	return A2(
		$elm$core$Basics$pow,
		10,
		$elm$core$Basics$floor(
			A2($elm$core$Basics$logBase, $elm$core$Basics$e, num) / A2($elm$core$Basics$logBase, $elm$core$Basics$e, 10)));
};
var $terezka$line_charts$Internal$Axis$Values$getInterval = F3(
	function (intervalRaw, allowDecimals, hasTickAmount) {
		var magnitude = $terezka$line_charts$Internal$Utils$magnitude(intervalRaw);
		var multiples = A3($terezka$line_charts$Internal$Axis$Values$getMultiples, magnitude, allowDecimals, hasTickAmount);
		var normalized = intervalRaw / magnitude;
		var findMultipleExact = function (multiples_) {
			findMultipleExact:
			while (true) {
				if (multiples_.b) {
					var m1 = multiples_.a;
					var rest = multiples_.b;
					if (_Utils_cmp(m1 * magnitude, intervalRaw) > -1) {
						return m1;
					} else {
						var $temp$multiples_ = rest;
						multiples_ = $temp$multiples_;
						continue findMultipleExact;
					}
				} else {
					return 1;
				}
			}
		};
		var findMultiple = function (multiples_) {
			findMultiple:
			while (true) {
				if (multiples_.b) {
					if (multiples_.b.b) {
						var m1 = multiples_.a;
						var _v2 = multiples_.b;
						var m2 = _v2.a;
						var rest = _v2.b;
						if (_Utils_cmp(normalized, (m1 + m2) / 2) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = A2($elm$core$List$cons, m2, rest);
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					} else {
						var m1 = multiples_.a;
						var rest = multiples_.b;
						if (_Utils_cmp(normalized, m1) < 1) {
							return m1;
						} else {
							var $temp$multiples_ = rest;
							multiples_ = $temp$multiples_;
							continue findMultiple;
						}
					}
				} else {
					return 1;
				}
			}
		};
		var multiple = hasTickAmount ? findMultipleExact(multiples) : findMultiple(multiples);
		var precision = $terezka$line_charts$Internal$Axis$Values$getPrecision(magnitude) + $terezka$line_charts$Internal$Axis$Values$getPrecision(multiple);
		return A2($terezka$line_charts$Internal$Axis$Values$correctFloat, precision, multiple * magnitude);
	});
var $terezka$line_charts$Internal$Axis$Values$positions = F5(
	function (range, beginning, interval, m, acc) {
		positions:
		while (true) {
			var next = A2(
				$terezka$line_charts$Internal$Axis$Values$correctFloat,
				$terezka$line_charts$Internal$Axis$Values$getPrecision(interval),
				beginning + (m * interval));
			if (_Utils_cmp(next, range.bL) > 0) {
				return acc;
			} else {
				var $temp$range = range,
					$temp$beginning = beginning,
					$temp$interval = interval,
					$temp$m = m + 1,
					$temp$acc = _Utils_ap(
					acc,
					_List_fromArray(
						[next]));
				range = $temp$range;
				beginning = $temp$beginning;
				interval = $temp$interval;
				m = $temp$m;
				acc = $temp$acc;
				continue positions;
			}
		}
	});
var $terezka$line_charts$Internal$Axis$Values$values = F4(
	function (allowDecimals, exact, amountRough, range) {
		var intervalRough = (range.bL - range.bM) / amountRough;
		var interval = A3($terezka$line_charts$Internal$Axis$Values$getInterval, intervalRough, allowDecimals, exact);
		var intervalSafe = (!interval) ? 1 : interval;
		var beginning = A2($terezka$line_charts$Internal$Axis$Values$getBeginning, range.bM, intervalSafe);
		var amountRoughSafe = (!amountRough) ? 1 : amountRough;
		return A5($terezka$line_charts$Internal$Axis$Values$positions, range, beginning, intervalSafe, 0, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$Values$float = function (amount) {
	if (!amount.$) {
		var amount_ = amount.a;
		return A3($terezka$line_charts$Internal$Axis$Values$values, true, true, amount_);
	} else {
		var amount_ = amount.a;
		return A3($terezka$line_charts$Internal$Axis$Values$values, true, false, amount_);
	}
};
var $terezka$line_charts$Internal$Axis$Tick$Negative = 0;
var $terezka$line_charts$Internal$Axis$Tick$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Tick$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Tick$float = function (n) {
	return $terezka$line_charts$Internal$Axis$Tick$custom(
		{
			cS: $terezka$line_charts$LineChart$Colors$gray,
			bZ: 0,
			b1: true,
			c9: $elm$core$Maybe$Just(
				A2(
					$terezka$line_charts$Internal$Svg$label,
					'inherit',
					$elm$core$String$fromFloat(n))),
			cg: 5,
			bO: n,
			dH: 1
		});
};
var $terezka$line_charts$LineChart$Axis$Tick$float = $terezka$line_charts$Internal$Axis$Tick$float;
var $terezka$line_charts$Internal$Axis$Range$Padded = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $terezka$line_charts$Internal$Axis$Range$padded = $terezka$line_charts$Internal$Axis$Range$Padded;
var $terezka$line_charts$Internal$Axis$Line$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Axis$Line$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Coordinate$smallestRange = F2(
	function (data, range_) {
		return {
			bL: A2($elm$core$Basics$min, data.bL, range_.bL),
			bM: A2($elm$core$Basics$max, data.bM, range_.bM)
		};
	});
var $terezka$line_charts$Internal$Axis$Line$rangeFrame = function (color) {
	return $terezka$line_charts$Internal$Axis$Line$custom(
		F2(
			function (data, range) {
				var smallest = A2($terezka$line_charts$Internal$Coordinate$smallestRange, data, range);
				return {cS: color, cY: smallest.bL, b$: _List_Nil, cD: smallest.bM, dH: 1};
			}));
};
var $terezka$line_charts$Internal$Axis$default = F3(
	function (pixels_, title_, variable_) {
		return $terezka$line_charts$Internal$Axis$custom(
			{
				aZ: $terezka$line_charts$Internal$Axis$Line$rangeFrame($terezka$line_charts$LineChart$Colors$gray),
				a5: pixels_,
				a6: A2($terezka$line_charts$Internal$Axis$Range$padded, 20, 20),
				aH: $terezka$line_charts$Internal$Axis$Ticks$custom(
					F2(
						function (data, range_) {
							var smallest = A2($terezka$line_charts$Internal$Coordinate$smallestRange, data, range_);
							var rangeSmall = smallest.bL - smallest.bM;
							var rangeLong = range_.bL - range_.bM;
							var diff = 1 - ((rangeLong - rangeSmall) / rangeLong);
							var amount = $elm$core$Basics$round((diff * pixels_) / 90);
							return A2(
								$elm$core$List$map,
								$terezka$line_charts$LineChart$Axis$Tick$float,
								A2(
									$terezka$line_charts$Internal$Axis$Values$float,
									$terezka$line_charts$Internal$Axis$Values$around(amount),
									smallest));
						})),
				ee: A3($terezka$line_charts$Internal$Axis$Title$atDataMax, 0, 0, title_),
				bc: A2($elm$core$Basics$composeL, $elm$core$Maybe$Just, variable_)
			});
	});
var $terezka$line_charts$LineChart$Axis$default = $terezka$line_charts$Internal$Axis$default;
var $terezka$line_charts$Internal$Axis$Intersection$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Data$Point = F2(
	function (x, y) {
		return {cI: x, cK: y};
	});
var $terezka$line_charts$Internal$Axis$Intersection$custom = F2(
	function (toX, toY) {
		return function (_v0) {
			var x = _v0.cI;
			var y = _v0.cK;
			return A2(
				$terezka$line_charts$Internal$Data$Point,
				toX(x),
				toY(y));
		};
	});
var $terezka$line_charts$Internal$Axis$Intersection$default = A2(
	$terezka$line_charts$Internal$Axis$Intersection$custom,
	function ($) {
		return $.bM;
	},
	function ($) {
		return $.bM;
	});
var $terezka$line_charts$LineChart$Axis$Intersection$default = $terezka$line_charts$Internal$Axis$Intersection$default;
var $terezka$line_charts$Internal$Dots$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Dots$Disconnected = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Dots$Style = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Dots$style = F2(
	function (radius, variety) {
		return {cq: radius, cG: variety};
	});
var $terezka$line_charts$Internal$Dots$disconnected = F2(
	function (radius, border) {
		return A2(
			$terezka$line_charts$Internal$Dots$style,
			radius,
			$terezka$line_charts$Internal$Dots$Disconnected(border));
	});
var $terezka$line_charts$Internal$Dots$default = {
	ca: function (_v0) {
		return A2($terezka$line_charts$Internal$Dots$disconnected, 10, 2);
	},
	ce: function (_v1) {
		return A2($terezka$line_charts$Internal$Dots$disconnected, 10, 2);
	}
};
var $terezka$line_charts$LineChart$Dots$default = $terezka$line_charts$Internal$Dots$default;
var $terezka$line_charts$Internal$Legends$Grouped = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $terezka$line_charts$Internal$Svg$Transfrom = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $terezka$line_charts$Internal$Svg$offset = F2(
	function (x, y) {
		return A2($terezka$line_charts$Internal$Svg$Transfrom, x, y);
	});
var $terezka$line_charts$Internal$Svg$addPosition = F2(
	function (_v0, _v1) {
		var x = _v0.a;
		var y = _v0.b;
		var xf = _v1.a;
		var yf = _v1.b;
		return A2($terezka$line_charts$Internal$Svg$Transfrom, xf + x, yf + y);
	});
var $terezka$line_charts$Internal$Svg$toPosition = A2(
	$elm$core$List$foldr,
	$terezka$line_charts$Internal$Svg$addPosition,
	A2($terezka$line_charts$Internal$Svg$Transfrom, 0, 0));
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $terezka$line_charts$Internal$Svg$transform = function (translations) {
	var _v0 = $terezka$line_charts$Internal$Svg$toPosition(translations);
	var x = _v0.a;
	var y = _v0.b;
	return $elm$svg$Svg$Attributes$transform(
		'translate(' + ($elm$core$String$fromFloat(x) + (', ' + ($elm$core$String$fromFloat(y) + ')'))));
};
var $terezka$line_charts$Internal$Legends$defaultLegend = F2(
	function (index, _v0) {
		var sample = _v0.ct;
		var label = _v0.c9;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__legend'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A2($terezka$line_charts$Internal$Svg$offset, 20, index * 20)
						]))
				]),
			_List_fromArray(
				[
					sample,
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$terezka$line_charts$Internal$Svg$transform(
							_List_fromArray(
								[
									A2($terezka$line_charts$Internal$Svg$offset, 40, 4)
								]))
						]),
					_List_fromArray(
						[
							A2($terezka$line_charts$Internal$Svg$label, 'inherit', label)
						]))
				]));
	});
var $terezka$line_charts$Internal$Coordinate$lengthX = function (system) {
	return A2($elm$core$Basics$max, 1, (system.bJ.eb.dH - system.bJ.d2.da) - system.bJ.d2.ea);
};
var $terezka$line_charts$Internal$Coordinate$reachX = function (system) {
	var diff = system.cI.bL - system.cI.bM;
	return (diff > 0) ? diff : 1;
};
var $terezka$line_charts$LineChart$Coordinate$scaleSvgX = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$lengthX(system)) / $terezka$line_charts$Internal$Coordinate$reachX(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toSvgX = F2(
	function (system, value) {
		return A2($terezka$line_charts$LineChart$Coordinate$scaleSvgX, system, value - system.cI.bM) + system.bJ.d2.da;
	});
var $terezka$line_charts$Internal$Coordinate$lengthY = function (system) {
	return A2($elm$core$Basics$max, 1, (system.bJ.eb.c1 - system.bJ.d2.dO) - system.bJ.d2.dC);
};
var $terezka$line_charts$Internal$Coordinate$reachY = function (system) {
	var diff = system.cK.bL - system.cK.bM;
	return (diff > 0) ? diff : 1;
};
var $terezka$line_charts$LineChart$Coordinate$scaleSvgY = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$lengthY(system)) / $terezka$line_charts$Internal$Coordinate$reachY(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toSvgY = F2(
	function (system, value) {
		return A2($terezka$line_charts$LineChart$Coordinate$scaleSvgY, system, system.cK.bL - value) + system.bJ.d2.dC;
	});
var $terezka$line_charts$Internal$Svg$move = F3(
	function (system, x, y) {
		return A2(
			$terezka$line_charts$Internal$Svg$Transfrom,
			A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x),
			A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
	});
var $terezka$line_charts$Internal$Legends$defaultLegends = F8(
	function (toX, toY, offsetX, offsetY, hovered, _arguments, system, legends) {
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__legends'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3(
							$terezka$line_charts$Internal$Svg$move,
							system,
							toX(system.cI),
							toY(system.cK)),
							A2($terezka$line_charts$Internal$Svg$offset, offsetX, offsetY)
						]))
				]),
			A2($elm$core$List$indexedMap, $terezka$line_charts$Internal$Legends$defaultLegend, legends));
	});
var $terezka$line_charts$Internal$Legends$hover = function (data) {
	return A2(
		$terezka$line_charts$Internal$Legends$Grouped,
		30,
		A5(
			$terezka$line_charts$Internal$Legends$defaultLegends,
			function ($) {
				return $.bL;
			},
			function ($) {
				return $.bL;
			},
			0,
			10,
			data));
};
var $terezka$line_charts$Internal$Legends$default = $terezka$line_charts$Internal$Legends$hover(_List_Nil);
var $terezka$line_charts$LineChart$Legends$default = $terezka$line_charts$Internal$Legends$default;
var $terezka$line_charts$Internal$Line$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$Style = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$style = F2(
	function (width, color_) {
		return {cS: color_, dH: width};
	});
var $terezka$line_charts$Internal$Line$default = function (_v0) {
	return A2($terezka$line_charts$Internal$Line$style, 1, $elm$core$Basics$identity);
};
var $terezka$line_charts$LineChart$Line$default = $terezka$line_charts$Internal$Line$default;
var $terezka$line_charts$Internal$Grid$Dots = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $terezka$line_charts$Internal$Grid$dots = $terezka$line_charts$Internal$Grid$Dots;
var $terezka$line_charts$LineChart$Grid$dots = $terezka$line_charts$Internal$Grid$dots;
var $author$project$Main$round100 = function (_float) {
	return $elm$core$Basics$round(_float * 100) / 100;
};
var $author$project$Main$dtFormat = function (sample) {
	return $elm$core$String$fromFloat(
		$author$project$Main$round100(sample.bI)) + ' ms';
};
var $terezka$line_charts$Internal$Events$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Events$custom = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Events$Decoder = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Events$distanceX = F3(
	function (system, searched, dot) {
		return $elm$core$Basics$abs(
			A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, dot.cI) - A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, searched.cI));
	});
var $terezka$line_charts$Internal$Events$getNearestXHelp = F3(
	function (points, system, searched) {
		var distanceX_ = A2($terezka$line_charts$Internal$Events$distanceX, system, searched);
		var getClosest = F2(
			function (point, allClosest) {
				var _v0 = $elm$core$List$head(allClosest);
				if (!_v0.$) {
					var closest = _v0.a;
					return _Utils_eq(closest.d8.cI, point.d8.cI) ? A2($elm$core$List$cons, point, allClosest) : ((_Utils_cmp(
						distanceX_(closest.d8),
						distanceX_(point.d8)) > 0) ? _List_fromArray(
						[point]) : allClosest);
				} else {
					return _List_fromArray(
						[point]);
				}
			});
		return A3($elm$core$List$foldl, getClosest, _List_Nil, points);
	});
var $terezka$line_charts$LineChart$Coordinate$scaleDataX = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$reachX(system)) / $terezka$line_charts$Internal$Coordinate$lengthX(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toDataX = F2(
	function (system, value) {
		return system.cI.bM + A2($terezka$line_charts$LineChart$Coordinate$scaleDataX, system, value - system.bJ.d2.da);
	});
var $terezka$line_charts$LineChart$Coordinate$scaleDataY = F2(
	function (system, value) {
		return (value * $terezka$line_charts$Internal$Coordinate$reachY(system)) / $terezka$line_charts$Internal$Coordinate$lengthY(system);
	});
var $terezka$line_charts$LineChart$Coordinate$toDataY = F2(
	function (system, value) {
		return system.cK.bL - A2($terezka$line_charts$LineChart$Coordinate$scaleDataY, system, value - system.bJ.d2.dC);
	});
var $terezka$line_charts$LineChart$Coordinate$toData = F2(
	function (system, point) {
		return {
			cI: A2($terezka$line_charts$LineChart$Coordinate$toDataX, system, point.cI),
			cK: A2($terezka$line_charts$LineChart$Coordinate$toDataY, system, point.cK)
		};
	});
var $terezka$line_charts$Internal$Events$getNearestX = F3(
	function (points, system, searchedSvg) {
		var searched = A2($terezka$line_charts$LineChart$Coordinate$toData, system, searchedSvg);
		return A2(
			$elm$core$List$map,
			function ($) {
				return $.el;
			},
			A3($terezka$line_charts$Internal$Events$getNearestXHelp, points, system, searched));
	});
var $terezka$line_charts$Internal$Events$Event = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$svg$Svg$Events$on = $elm$html$Html$Events$on;
var $terezka$line_charts$Internal$Events$onMouseLeave = function (msg) {
	return A2(
		$terezka$line_charts$Internal$Events$Event,
		false,
		F2(
			function (_v0, _v1) {
				return A2(
					$elm$svg$Svg$Events$on,
					'mouseleave',
					$elm$json$Json$Decode$succeed(msg));
			}));
};
var $terezka$line_charts$Internal$Events$Options = F3(
	function (stopPropagation, preventDefault, catchOutsideChart) {
		return {cO: catchOutsideChart, cp: preventDefault, cE: stopPropagation};
	});
var $elm$virtual_dom$VirtualDom$Custom = function (a) {
	return {$: 3, a: a};
};
var $elm$html$Html$Events$custom = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Custom(decoder));
	});
var $elm$svg$Svg$Events$custom = $elm$html$Html$Events$custom;
var $terezka$line_charts$Internal$Events$map = F2(
	function (f, _v0) {
		var a = _v0;
		return F3(
			function (ps, s, p) {
				return f(
					A3(a, ps, s, p));
			});
	});
var $terezka$line_charts$LineChart$Coordinate$Point = F2(
	function (x, y) {
		return {cI: x, cK: y};
	});
var $elm$json$Json$Decode$map3 = _Json_map3;
var $debois$elm_dom$DOM$offsetHeight = A2($elm$json$Json$Decode$field, 'offsetHeight', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$offsetWidth = A2($elm$json$Json$Decode$field, 'offsetWidth', $elm$json$Json$Decode$float);
var $elm$json$Json$Decode$map4 = _Json_map4;
var $debois$elm_dom$DOM$offsetLeft = A2($elm$json$Json$Decode$field, 'offsetLeft', $elm$json$Json$Decode$float);
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $debois$elm_dom$DOM$offsetParent = F2(
	function (x, decoder) {
		return $elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2(
					$elm$json$Json$Decode$field,
					'offsetParent',
					$elm$json$Json$Decode$null(x)),
					A2($elm$json$Json$Decode$field, 'offsetParent', decoder)
				]));
	});
var $debois$elm_dom$DOM$offsetTop = A2($elm$json$Json$Decode$field, 'offsetTop', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$scrollLeft = A2($elm$json$Json$Decode$field, 'scrollLeft', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$scrollTop = A2($elm$json$Json$Decode$field, 'scrollTop', $elm$json$Json$Decode$float);
var $debois$elm_dom$DOM$position = F2(
	function (x, y) {
		return A2(
			$elm$json$Json$Decode$andThen,
			function (_v0) {
				var x_ = _v0.a;
				var y_ = _v0.b;
				return A2(
					$debois$elm_dom$DOM$offsetParent,
					_Utils_Tuple2(x_, y_),
					A2($debois$elm_dom$DOM$position, x_, y_));
			},
			A5(
				$elm$json$Json$Decode$map4,
				F4(
					function (scrollLeftP, scrollTopP, offsetLeftP, offsetTopP) {
						return _Utils_Tuple2((x + offsetLeftP) - scrollLeftP, (y + offsetTopP) - scrollTopP);
					}),
				$debois$elm_dom$DOM$scrollLeft,
				$debois$elm_dom$DOM$scrollTop,
				$debois$elm_dom$DOM$offsetLeft,
				$debois$elm_dom$DOM$offsetTop));
	});
var $debois$elm_dom$DOM$boundingClientRect = A4(
	$elm$json$Json$Decode$map3,
	F3(
		function (_v0, width, height) {
			var x = _v0.a;
			var y = _v0.b;
			return {c1: height, da: x, dC: y, dH: width};
		}),
	A2($debois$elm_dom$DOM$position, 0, 0),
	$debois$elm_dom$DOM$offsetWidth,
	$debois$elm_dom$DOM$offsetHeight);
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
var $debois$elm_dom$DOM$parentElement = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'parentElement', decoder);
};
function $terezka$line_charts$Internal$Events$cyclic$position() {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$debois$elm_dom$DOM$boundingClientRect,
				$elm$json$Json$Decode$lazy(
				function (_v0) {
					return $debois$elm_dom$DOM$parentElement(
						$terezka$line_charts$Internal$Events$cyclic$position());
				})
			]));
}
var $terezka$line_charts$Internal$Events$position = $terezka$line_charts$Internal$Events$cyclic$position();
$terezka$line_charts$Internal$Events$cyclic$position = function () {
	return $terezka$line_charts$Internal$Events$position;
};
var $debois$elm_dom$DOM$target = function (decoder) {
	return A2($elm$json$Json$Decode$field, 'target', decoder);
};
var $terezka$line_charts$Internal$Events$toJsonDecoder = F4(
	function (options, data, system, _v0) {
		var decoder = _v0;
		var withOptions = function (msg) {
			return {a$: msg, cp: options.cp, cE: options.cE};
		};
		var handle = F3(
			function (mouseX, mouseY, _v1) {
				var left = _v1.da;
				var top = _v1.dC;
				var height = _v1.c1;
				var width = _v1.dH;
				var y = mouseY - top;
				var x = mouseX - left;
				var widthPercent = width / system.bJ.eb.dH;
				var newSize = {c1: height, dH: width};
				var heightPercent = height / system.bJ.eb.c1;
				var newMargin = {dO: system.bJ.d2.dO * heightPercent, da: system.bJ.d2.da * widthPercent, ea: system.bJ.d2.ea * widthPercent, dC: system.bJ.d2.dC * heightPercent};
				var newSystem = _Utils_update(
					system,
					{
						bJ: {d2: newMargin, eb: newSize}
					});
				return A3(
					decoder,
					data,
					newSystem,
					A2($terezka$line_charts$LineChart$Coordinate$Point, x, y));
			});
		return A2(
			$elm$json$Json$Decode$map,
			withOptions,
			A4(
				$elm$json$Json$Decode$map3,
				handle,
				A2($elm$json$Json$Decode$field, 'pageX', $elm$json$Json$Decode$float),
				A2($elm$json$Json$Decode$field, 'pageY', $elm$json$Json$Decode$float),
				$debois$elm_dom$DOM$target($terezka$line_charts$Internal$Events$position)));
	});
var $terezka$line_charts$Internal$Events$on = F3(
	function (event, toMsg, decoder) {
		return A2(
			$terezka$line_charts$Internal$Events$Event,
			false,
			F2(
				function (data, system) {
					var defaultOptions = A3($terezka$line_charts$Internal$Events$Options, false, false, false);
					return A2(
						$elm$svg$Svg$Events$custom,
						event,
						A4(
							$terezka$line_charts$Internal$Events$toJsonDecoder,
							defaultOptions,
							data,
							system,
							A2($terezka$line_charts$Internal$Events$map, toMsg, decoder)));
				}));
	});
var $terezka$line_charts$Internal$Events$onMouseMove = $terezka$line_charts$Internal$Events$on('mousemove');
var $terezka$line_charts$Internal$Events$hoverMany = function (msg) {
	return $terezka$line_charts$Internal$Events$custom(
		_List_fromArray(
			[
				A2($terezka$line_charts$Internal$Events$onMouseMove, msg, $terezka$line_charts$Internal$Events$getNearestX),
				$terezka$line_charts$Internal$Events$onMouseLeave(
				msg(_List_Nil))
			]));
};
var $terezka$line_charts$LineChart$Events$hoverMany = $terezka$line_charts$Internal$Events$hoverMany;
var $terezka$line_charts$Internal$Junk$Config = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Junk$find = F2(
	function (hovered, data) {
		find:
		while (true) {
			if (!hovered.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var first = hovered.a;
				var rest = hovered.b;
				if (A2(
					$elm$core$List$any,
					$elm$core$Basics$eq(first),
					data)) {
					return $elm$core$Maybe$Just(first);
				} else {
					var $temp$hovered = rest,
						$temp$data = data;
					hovered = $temp$hovered;
					data = $temp$data;
					continue find;
				}
			}
		}
	});
var $terezka$line_charts$Internal$Junk$shouldFlip = F2(
	function (system, x) {
		return _Utils_cmp(x - system.cI.bM, system.cI.bL - x) > 0;
	});
var $terezka$line_charts$Internal$Junk$standardStyles = _List_fromArray(
	[
		_Utils_Tuple2('padding', '5px'),
		_Utils_Tuple2('min-width', '100px'),
		_Utils_Tuple2('background', 'rgba(255,255,255,0.8)'),
		_Utils_Tuple2('border', '1px solid #d3d3d3'),
		_Utils_Tuple2('border-radius', '5px'),
		_Utils_Tuple2('pointer-events', 'none')
	]);
var $terezka$line_charts$Internal$Junk$hoverAt = F5(
	function (system, x, y, styles, view) {
		var yPercentage = (A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y) * 100) / system.bJ.eb.c1;
		var space = A2($terezka$line_charts$Internal$Junk$shouldFlip, system, x) ? (-15) : 15;
		var xPercentage = ((A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x) + space) * 100) / system.bJ.eb.dH;
		var positionStyles = _List_fromArray(
			[
				_Utils_Tuple2(
				'left',
				$elm$core$String$fromFloat(xPercentage) + '%'),
				_Utils_Tuple2(
				'top',
				$elm$core$String$fromFloat(yPercentage) + '%'),
				_Utils_Tuple2('margin-right', '-400px'),
				_Utils_Tuple2('position', 'absolute'),
				A2($terezka$line_charts$Internal$Junk$shouldFlip, system, x) ? _Utils_Tuple2('transform', 'translateX(-100%)') : _Utils_Tuple2('transform', 'translateX(0)')
			]);
		var containerStyles = _Utils_ap(
			$terezka$line_charts$Internal$Junk$standardStyles,
			_Utils_ap(positionStyles, styles));
		return A2(
			$elm$html$Html$div,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var p = _v0.a;
					var v = _v0.b;
					return A2($elm$html$Html$Attributes$style, p, v);
				},
				containerStyles),
			view);
	});
var $terezka$line_charts$Internal$Junk$middle = F2(
	function (r, system) {
		var range = r(system);
		return range.bM + ((range.bL - range.bM) / 2);
	});
var $terezka$line_charts$Internal$Junk$hover = F3(
	function (system, x, styles) {
		var y = A2(
			$terezka$line_charts$Internal$Junk$middle,
			function ($) {
				return $.cK;
			},
			system);
		var containerStyles = _Utils_ap(
			_List_fromArray(
				[
					A2($terezka$line_charts$Internal$Junk$shouldFlip, system, x) ? _Utils_Tuple2('transform', 'translate(-100%, -50%)') : _Utils_Tuple2('transform', 'translate(0, -50%)')
				]),
			styles);
		return A4($terezka$line_charts$Internal$Junk$hoverAt, system, x, y, containerStyles);
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $avh4$elm_color$Color$toCssString = function (_v0) {
	var r = _v0.a;
	var g = _v0.b;
	var b = _v0.c;
	var a = _v0.d;
	var roundTo = function (x) {
		return $elm$core$Basics$round(x * 1000) / 1000;
	};
	var pct = function (x) {
		return $elm$core$Basics$round(x * 10000) / 100;
	};
	return $elm$core$String$concat(
		_List_fromArray(
			[
				'rgba(',
				$elm$core$String$fromFloat(
				pct(r)),
				'%,',
				$elm$core$String$fromFloat(
				pct(g)),
				'%,',
				$elm$core$String$fromFloat(
				pct(b)),
				'%,',
				$elm$core$String$fromFloat(
				roundTo(a)),
				')'
			]));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $terezka$line_charts$Internal$Junk$viewHeader = $elm$html$Html$p(
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$style, 'margin-top', '3px'),
			A2($elm$html$Html$Attributes$style, 'margin-bottom', '5px'),
			A2($elm$html$Html$Attributes$style, 'padding', '3px'),
			A2($elm$html$Html$Attributes$style, 'border-bottom', '1px solid rgb(163, 163, 163)')
		]));
var $terezka$line_charts$Internal$Utils$viewMaybe = F2(
	function (a, view) {
		return A2(
			$elm$core$Maybe$withDefault,
			$elm$svg$Svg$text(''),
			A2($elm$core$Maybe$map, view, a));
	});
var $terezka$line_charts$Internal$Junk$viewRow = F3(
	function (color, label, value) {
		return A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'margin', '3px'),
					A2($elm$html$Html$Attributes$style, 'color', color)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(label + (': ' + value))
				]));
	});
var $terezka$line_charts$Internal$Junk$hoverManyHtml = F8(
	function (system, toX, toY, formatX, formatY, first, hovered, series) {
		var x = A2(
			$elm$core$Maybe$withDefault,
			A2(
				$terezka$line_charts$Internal$Junk$middle,
				function ($) {
					return $.cI;
				},
				system),
			toX(first));
		var viewValue = function (_v0) {
			var color = _v0.a;
			var label = _v0.b;
			var data = _v0.c;
			return A2(
				$terezka$line_charts$Internal$Utils$viewMaybe,
				A2($terezka$line_charts$Internal$Junk$find, hovered, data),
				function (hovered_) {
					return A3(
						$terezka$line_charts$Internal$Junk$viewRow,
						$avh4$elm_color$Color$toCssString(color),
						label,
						formatY(hovered_));
				});
		};
		return A4(
			$terezka$line_charts$Internal$Junk$hover,
			system,
			x,
			_List_Nil,
			A2(
				$elm$core$List$cons,
				$terezka$line_charts$Internal$Junk$viewHeader(
					_List_fromArray(
						[
							$elm$html$Html$text(
							formatX(first))
						])),
				A2($elm$core$List$map, viewValue, series)));
	});
var $terezka$line_charts$Internal$Junk$Layers = F3(
	function (below, above, html) {
		return {bT: above, bt: below, b3: html};
	});
var $terezka$line_charts$Internal$Junk$none = F4(
	function (_v0, _v1, _v2, _v3) {
		return A3($terezka$line_charts$Internal$Junk$Layers, _List_Nil, _List_Nil, _List_Nil);
	});
var $terezka$line_charts$Internal$Utils$concat = F3(
	function (first, second, third) {
		return _Utils_ap(
			first,
			_Utils_ap(second, third));
	});
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $terezka$line_charts$Internal$Path$Line = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Path$Move = function (a) {
	return {$: 0, a: a};
};
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $terezka$line_charts$Internal$Path$join = function (commands) {
	return A2($elm$core$String$join, ' ', commands);
};
var $terezka$line_charts$Internal$Path$bool = function (bool_) {
	return bool_ ? '1' : '0';
};
var $terezka$line_charts$Internal$Path$point = function (point_) {
	return $elm$core$String$fromFloat(point_.cI) + (' ' + $elm$core$String$fromFloat(point_.cK));
};
var $terezka$line_charts$Internal$Path$points = function (points_) {
	return A2(
		$elm$core$String$join,
		',',
		A2($elm$core$List$map, $terezka$line_charts$Internal$Path$point, points_));
};
var $terezka$line_charts$Internal$Path$toString = function (command) {
	switch (command.$) {
		case 9:
			return 'Z';
		case 0:
			var p = command.a;
			return 'M' + $terezka$line_charts$Internal$Path$point(p);
		case 1:
			var p = command.a;
			return 'L' + $terezka$line_charts$Internal$Path$point(p);
		case 2:
			var x = command.a;
			return 'H' + $elm$core$String$fromFloat(x);
		case 3:
			var y = command.a;
			return 'V' + $elm$core$String$fromFloat(y);
		case 4:
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return 'C' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, c2, p]));
		case 5:
			var c1 = command.a;
			var p = command.b;
			return 'Q' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 6:
			var c1 = command.a;
			var p = command.b;
			return 'Q' + $terezka$line_charts$Internal$Path$points(
				_List_fromArray(
					[c1, p]));
		case 7:
			var p = command.a;
			return 'T' + $terezka$line_charts$Internal$Path$point(p);
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return 'A' + $terezka$line_charts$Internal$Path$join(
				_List_fromArray(
					[
						$elm$core$String$fromFloat(rx),
						$elm$core$String$fromFloat(ry),
						$elm$core$String$fromInt(xAxisRotation),
						$terezka$line_charts$Internal$Path$bool(largeArcFlag),
						$terezka$line_charts$Internal$Path$bool(sweepFlag),
						$terezka$line_charts$Internal$Path$point(p)
					]));
	}
};
var $terezka$line_charts$Internal$Path$Arc = F6(
	function (a, b, c, d, e, f) {
		return {$: 8, a: a, b: b, c: c, d: d, e: e, f: f};
	});
var $terezka$line_charts$Internal$Path$Close = {$: 9};
var $terezka$line_charts$Internal$Path$CubicBeziers = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $terezka$line_charts$Internal$Path$CubicBeziersShort = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $terezka$line_charts$Internal$Path$Horizontal = function (a) {
	return {$: 2, a: a};
};
var $terezka$line_charts$Internal$Path$QuadraticBeziers = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $terezka$line_charts$Internal$Path$QuadraticBeziersShort = function (a) {
	return {$: 7, a: a};
};
var $terezka$line_charts$Internal$Path$Vertical = function (a) {
	return {$: 3, a: a};
};
var $terezka$line_charts$LineChart$Coordinate$toSvg = F2(
	function (system, point) {
		return {
			cI: A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, point.cI),
			cK: A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, point.cK)
		};
	});
var $terezka$line_charts$Internal$Path$translate = F2(
	function (system, command) {
		switch (command.$) {
			case 0:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$Move(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 1:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$Line(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 2:
				var x = command.a;
				return $terezka$line_charts$Internal$Path$Horizontal(
					A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x));
			case 3:
				var y = command.a;
				return $terezka$line_charts$Internal$Path$Vertical(
					A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y));
			case 4:
				var c1 = command.a;
				var c2 = command.b;
				var p = command.c;
				return A3(
					$terezka$line_charts$Internal$Path$CubicBeziers,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c2),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 5:
				var c1 = command.a;
				var p = command.b;
				return A2(
					$terezka$line_charts$Internal$Path$CubicBeziersShort,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 6:
				var c1 = command.a;
				var p = command.b;
				return A2(
					$terezka$line_charts$Internal$Path$QuadraticBeziers,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, c1),
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 7:
				var p = command.a;
				return $terezka$line_charts$Internal$Path$QuadraticBeziersShort(
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			case 8:
				var rx = command.a;
				var ry = command.b;
				var xAxisRotation = command.c;
				var largeArcFlag = command.d;
				var sweepFlag = command.e;
				var p = command.f;
				return A6(
					$terezka$line_charts$Internal$Path$Arc,
					rx,
					ry,
					xAxisRotation,
					largeArcFlag,
					sweepFlag,
					A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, p));
			default:
				return $terezka$line_charts$Internal$Path$Close;
		}
	});
var $terezka$line_charts$Internal$Path$description = F2(
	function (system, commands) {
		return $terezka$line_charts$Internal$Path$join(
			A2(
				$elm$core$List$map,
				A2(
					$elm$core$Basics$composeR,
					$terezka$line_charts$Internal$Path$translate(system),
					$terezka$line_charts$Internal$Path$toString),
				commands));
	});
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $terezka$line_charts$Internal$Path$viewPath = function (attributes) {
	return A2($elm$svg$Svg$path, attributes, _List_Nil);
};
var $terezka$line_charts$Internal$Path$view = F3(
	function (system, attributes, commands) {
		return $terezka$line_charts$Internal$Path$viewPath(
			_Utils_ap(
				attributes,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$d(
						A2($terezka$line_charts$Internal$Path$description, system, commands))
					])));
	});
var $terezka$line_charts$Internal$Svg$vertical = F5(
	function (system, userAttributes, x, y1, y2) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			$terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Path$Move(
					{cI: x, cK: y1}),
					$terezka$line_charts$Internal$Path$Line(
					{cI: x, cK: y1}),
					$terezka$line_charts$Internal$Path$Line(
					{cI: x, cK: y2})
				]));
	});
var $terezka$line_charts$Internal$Svg$verticalGrid = F3(
	function (system, userAttributes, x) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5($terezka$line_charts$Internal$Svg$vertical, system, attributes, x, system.cK.bM, system.cK.bL);
	});
var $terezka$line_charts$Internal$Junk$hoverMany = F3(
	function (hovered, formatX, formatY) {
		if (!hovered.b) {
			return $terezka$line_charts$Internal$Junk$none;
		} else {
			var first = hovered.a;
			var rest = hovered.b;
			return F4(
				function (series, toX, toY, system) {
					var xValue = A2(
						$elm$core$Maybe$withDefault,
						0,
						toX(first));
					return {
						bT: _List_Nil,
						bt: _List_fromArray(
							[
								A3($terezka$line_charts$Internal$Svg$verticalGrid, system, _List_Nil, xValue)
							]),
						b3: _List_fromArray(
							[
								A8($terezka$line_charts$Internal$Junk$hoverManyHtml, system, toX, toY, formatX, formatY, first, hovered, series)
							])
					};
				});
		}
	});
var $terezka$line_charts$LineChart$Junk$hoverMany = $terezka$line_charts$Internal$Junk$hoverMany;
var $author$project$Main$indexFormat = function (sample) {
	return $elm$core$String$fromInt(sample.bl);
};
var $terezka$line_charts$Internal$Interpolation$Monotone = 1;
var $terezka$line_charts$LineChart$Interpolation$monotone = 1;
var $author$project$Main$dtChartConfig = function (hinted) {
	return {
		bU: $terezka$line_charts$LineChart$Area$default,
		bW: $author$project$Main$containerConfig('line-chart-area-ds'),
		b_: $terezka$line_charts$LineChart$Dots$default,
		b$: $terezka$line_charts$LineChart$Events$hoverMany($author$project$Main$Hinted),
		b1: A2($terezka$line_charts$LineChart$Grid$dots, 1, $terezka$line_charts$LineChart$Colors$gray),
		cb: $terezka$line_charts$LineChart$Interpolation$monotone,
		cc: $terezka$line_charts$LineChart$Axis$Intersection$default,
		cd: A3($terezka$line_charts$LineChart$Junk$hoverMany, hinted, $author$project$Main$indexFormat, $author$project$Main$dtFormat),
		cf: $terezka$line_charts$LineChart$Legends$default,
		ch: $terezka$line_charts$LineChart$Line$default,
		cI: A3(
			$terezka$line_charts$LineChart$Axis$default,
			1270,
			'index',
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bl;
				},
				$elm$core$Basics$toFloat)),
		cK: A3(
			$terezka$line_charts$LineChart$Axis$default,
			450,
			'time (ms)',
			function ($) {
				return $.bI;
			})
	};
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $terezka$line_charts$Internal$Line$Series = $elm$core$Basics$identity;
var $terezka$line_charts$Internal$Line$SeriesConfig = F5(
	function (color, shape, dashing, label, data) {
		return {cS: color, cU: dashing, bX: data, c9: label, dx: shape};
	});
var $terezka$line_charts$Internal$Line$line = F4(
	function (color_, shape_, label_, data_) {
		return A5($terezka$line_charts$Internal$Line$SeriesConfig, color_, shape_, _List_Nil, label_, data_);
	});
var $terezka$line_charts$LineChart$line = $terezka$line_charts$Internal$Line$line;
var $terezka$line_charts$Internal$Dots$None = 0;
var $terezka$line_charts$LineChart$Dots$none = 0;
var $author$project$Main$propertiesToString = function (properties) {
	return A2(
		$elm$core$String$join,
		'/',
		_List_fromArray(
			[
				$elm$core$String$fromInt(properties.a3),
				$author$project$Main$benchmarkTypeToString(properties.bq),
				$author$project$Main$ecsFrameworkToString(properties.bx),
				$elm$core$String$fromInt(properties.dU),
				$elm$core$String$fromInt(properties.bQ) + ('x' + $author$project$Main$updateTypeToString(properties.bR))
			]));
};
var $author$project$Main$toSeries = F2(
	function (result, color) {
		return A4(
			$terezka$line_charts$LineChart$line,
			color,
			$terezka$line_charts$LineChart$Dots$none,
			$author$project$Main$propertiesToString(result.bm),
			result.bX.cu);
	});
var $terezka$line_charts$Internal$Area$Normal = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Area$normal = $terezka$line_charts$Internal$Area$Normal;
var $terezka$line_charts$LineChart$Area$normal = $terezka$line_charts$Internal$Area$normal;
var $author$project$Main$totalHeapSizeFormat = function (sample) {
	return $elm$core$String$fromInt(sample.bP) + ' bytes';
};
var $author$project$Main$totalHeapSizeChartConfig = function (hinted) {
	return {
		bU: $terezka$line_charts$LineChart$Area$normal(0.05),
		bW: $author$project$Main$containerConfig('line-chart-area-total-heap-size'),
		b_: $terezka$line_charts$LineChart$Dots$default,
		b$: $terezka$line_charts$LineChart$Events$hoverMany($author$project$Main$Hinted),
		b1: A2($terezka$line_charts$LineChart$Grid$dots, 1, $terezka$line_charts$LineChart$Colors$gray),
		cb: $terezka$line_charts$LineChart$Interpolation$monotone,
		cc: $terezka$line_charts$LineChart$Axis$Intersection$default,
		cd: A3($terezka$line_charts$LineChart$Junk$hoverMany, hinted, $author$project$Main$indexFormat, $author$project$Main$totalHeapSizeFormat),
		cf: $terezka$line_charts$LineChart$Legends$default,
		ch: $terezka$line_charts$LineChart$Line$default,
		cI: A3(
			$terezka$line_charts$LineChart$Axis$default,
			1270,
			'update index',
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bl;
				},
				$elm$core$Basics$toFloat)),
		cK: A3(
			$terezka$line_charts$LineChart$Axis$default,
			450,
			'size (bytes)',
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bP;
				},
				$elm$core$Basics$toFloat))
	};
};
var $author$project$Main$usedHeapSizeFormat = function (sample) {
	return $elm$core$String$fromInt(sample.bS) + ' bytes';
};
var $author$project$Main$usedHeapSizeChartConfig = function (hinted) {
	return {
		bU: $terezka$line_charts$LineChart$Area$normal(0.05),
		bW: $author$project$Main$containerConfig('line-chart-area-used-heap-size'),
		b_: $terezka$line_charts$LineChart$Dots$default,
		b$: $terezka$line_charts$LineChart$Events$hoverMany($author$project$Main$Hinted),
		b1: A2($terezka$line_charts$LineChart$Grid$dots, 1, $terezka$line_charts$LineChart$Colors$gray),
		cb: $terezka$line_charts$LineChart$Interpolation$monotone,
		cc: $terezka$line_charts$LineChart$Axis$Intersection$default,
		cd: A3($terezka$line_charts$LineChart$Junk$hoverMany, hinted, $author$project$Main$indexFormat, $author$project$Main$usedHeapSizeFormat),
		cf: $terezka$line_charts$LineChart$Legends$default,
		ch: $terezka$line_charts$LineChart$Line$default,
		cI: A3(
			$terezka$line_charts$LineChart$Axis$default,
			1270,
			'update index',
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bl;
				},
				$elm$core$Basics$toFloat)),
		cK: A3(
			$terezka$line_charts$LineChart$Axis$default,
			450,
			'size (bytes)',
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.bS;
				},
				$elm$core$Basics$toFloat))
	};
};
var $terezka$line_charts$Internal$Junk$addBelow = F2(
	function (below, layers) {
		return _Utils_update(
			layers,
			{
				bt: _Utils_ap(below, layers.bt)
			});
	});
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $terezka$line_charts$LineChart$chartAreaAttributes = function (system) {
	return _List_fromArray(
		[
			$elm$svg$Svg$Attributes$x(
			$elm$core$String$fromFloat(system.bJ.d2.da)),
			$elm$svg$Svg$Attributes$y(
			$elm$core$String$fromFloat(system.bJ.d2.dC)),
			$elm$svg$Svg$Attributes$width(
			$elm$core$String$fromFloat(
				$terezka$line_charts$Internal$Coordinate$lengthX(system))),
			$elm$svg$Svg$Attributes$height(
			$elm$core$String$fromFloat(
				$terezka$line_charts$Internal$Coordinate$lengthY(system)))
		]);
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $terezka$line_charts$Internal$Events$toChartAttributes = F3(
	function (data, system, _v0) {
		var events = _v0;
		var order = function (_v1) {
			var outside = _v1.a;
			var event = _v1.b;
			return outside ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				A2(event, data, system));
		};
		return A2($elm$core$List$filterMap, order, events);
	});
var $terezka$line_charts$LineChart$chartAreaPlatform = F3(
	function (config, data, system) {
		var attributes = $elm$core$List$concat(
			_List_fromArray(
				[
					_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill('transparent')
					]),
					$terezka$line_charts$LineChart$chartAreaAttributes(system),
					A3($terezka$line_charts$Internal$Events$toChartAttributes, data, system, config.b$)
				]));
		return A2($elm$svg$Svg$rect, attributes, _List_Nil);
	});
var $elm$svg$Svg$clipPath = $elm$svg$Svg$trustedNode('clipPath');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $terezka$line_charts$Internal$Utils$toChartAreaId = function (id) {
	return 'chart__chart-area--' + id;
};
var $terezka$line_charts$LineChart$clipPath = function (system) {
	return A2(
		$elm$svg$Svg$clipPath,
		_List_fromArray(
			[
				$elm$svg$Svg$Attributes$id(
				$terezka$line_charts$Internal$Utils$toChartAreaId(system.a3))
			]),
		_List_fromArray(
			[
				A2(
				$elm$svg$Svg$rect,
				$terezka$line_charts$LineChart$chartAreaAttributes(system),
				_List_Nil)
			]));
};
var $terezka$line_charts$Internal$Line$color = F3(
	function (_v0, _v1, data_) {
		var config = _v0;
		var line_ = _v1;
		var _v2 = config(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.el;
				},
				data_));
		var style_ = _v2;
		return style_.cS(line_.cS);
	});
var $terezka$line_charts$Internal$Container$properties = F2(
	function (f, _v0) {
		var properties_ = _v0;
		return f(properties_);
	});
var $terezka$line_charts$Internal$Container$sizeStyles = F3(
	function (_v0, width, height) {
		var properties_ = _v0;
		var _v1 = properties_.eb;
		if (!_v1) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$Attributes$style,
					'height',
					$elm$core$String$fromFloat(height) + 'px'),
					A2(
					$elm$html$Html$Attributes$style,
					'width',
					$elm$core$String$fromFloat(width) + 'px')
				]);
		} else {
			return _List_Nil;
		}
	});
var $terezka$line_charts$LineChart$container = F4(
	function (config, _v0, junkHtml, plot) {
		var frame = _v0.bJ;
		var userAttributes = A2(
			$terezka$line_charts$Internal$Container$properties,
			function ($) {
				return $.dL;
			},
			config.bW);
		var sizeStyles = A3($terezka$line_charts$Internal$Container$sizeStyles, config.bW, frame.eb.dH, frame.eb.c1);
		var styles = A2(
			$elm$core$List$cons,
			A2($elm$html$Html$Attributes$style, 'position', 'relative'),
			sizeStyles);
		return A2(
			$elm$html$Html$div,
			_Utils_ap(styles, userAttributes),
			A2($elm$core$List$cons, plot, junkHtml));
	});
var $terezka$line_charts$Internal$Line$data = function (_v0) {
	var config = _v0;
	return config.bX;
};
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $terezka$line_charts$Internal$Junk$getLayers = F5(
	function (series, toX, toY, system, _v0) {
		var toLayers = _v0;
		return A4(toLayers, series, toX, toY, system);
	});
var $terezka$line_charts$Internal$Line$label = function (_v0) {
	var config = _v0;
	return config.c9;
};
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $terezka$line_charts$Internal$Events$toContainerAttributes = F3(
	function (data, system, _v0) {
		var events = _v0;
		var order = function (_v1) {
			var outside = _v1.a;
			var event = _v1.b;
			return outside ? $elm$core$Maybe$Just(
				A2(event, data, system)) : $elm$core$Maybe$Nothing;
		};
		return A2($elm$core$List$filterMap, order, events);
	});
var $terezka$line_charts$Internal$Data$Data = F3(
	function (user, point, isReal) {
		return {d1: isReal, d8: point, el: user};
	});
var $terezka$line_charts$LineChart$setY = F2(
	function (datum, y) {
		return A3(
			$terezka$line_charts$Internal$Data$Data,
			datum.el,
			A2($terezka$line_charts$Internal$Data$Point, datum.d8.cI, y),
			datum.d1);
	});
var $terezka$line_charts$LineChart$normalize = function (datasets) {
	if (datasets.b) {
		var highest = datasets.a;
		var belows = datasets.b;
		var toPercentage = F2(
			function (highest_, datum) {
				return A2($terezka$line_charts$LineChart$setY, datum, (100 * datum.d8.cK) / highest_.d8.cK);
			});
		return A2(
			$elm$core$List$map,
			A2($elm$core$List$map2, toPercentage, highest),
			A2($elm$core$List$cons, highest, belows));
	} else {
		return datasets;
	}
};
var $terezka$line_charts$Internal$Utils$withFirst = F2(
	function (stuff, process) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return $elm$core$Maybe$Just(
				A2(process, first, rest));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $terezka$line_charts$LineChart$addBelows = F2(
	function (alldata, dataBelowAll) {
		var add = F2(
			function (below, datum) {
				return A2($terezka$line_charts$LineChart$setY, below, below.d8.cK + datum.d8.cK);
			});
		var iterate = F4(
			function (datum0, dataTop, dataBelowTop, result) {
				iterate:
				while (true) {
					var _v0 = _Utils_Tuple2(dataTop, dataBelowTop);
					if (_v0.a.b) {
						if (_v0.b.b) {
							var _v1 = _v0.a;
							var datum1 = _v1.a;
							var data = _v1.b;
							var _v2 = _v0.b;
							var datumBelow = _v2.a;
							var dataBelow = _v2.b;
							if (_Utils_cmp(datum1.d8.cI, datumBelow.d8.cI) > 0) {
								if (datumBelow.d1) {
									var $temp$datum0 = datum0,
										$temp$dataTop = A2($elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										$elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								} else {
									var breakdata = _Utils_update(
										datum0,
										{d1: false});
									var $temp$datum0 = datum0,
										$temp$dataTop = A2($elm$core$List$cons, datum1, data),
										$temp$dataBelowTop = dataBelow,
										$temp$result = A2(
										$elm$core$List$cons,
										A2(add, datumBelow, datum0),
										result);
									datum0 = $temp$datum0;
									dataTop = $temp$dataTop;
									dataBelowTop = $temp$dataBelowTop;
									result = $temp$result;
									continue iterate;
								}
							} else {
								var $temp$datum0 = datum1,
									$temp$dataTop = data,
									$temp$dataBelowTop = A2($elm$core$List$cons, datumBelow, dataBelow),
									$temp$result = result;
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							var _v4 = _v0.a;
							var datum1 = _v4.a;
							var data = _v4.b;
							return result;
						}
					} else {
						if (_v0.b.b) {
							var _v3 = _v0.b;
							var datumBelow = _v3.a;
							var dataBelow = _v3.b;
							if (_Utils_cmp(datum0.d8.cI, datumBelow.d8.cI) < 1) {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2(
									$elm$core$List$cons,
									A2(add, datumBelow, datum0),
									result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							} else {
								var $temp$datum0 = datum0,
									$temp$dataTop = _List_Nil,
									$temp$dataBelowTop = dataBelow,
									$temp$result = A2($elm$core$List$cons, datumBelow, result);
								datum0 = $temp$datum0;
								dataTop = $temp$dataTop;
								dataBelowTop = $temp$dataBelowTop;
								result = $temp$result;
								continue iterate;
							}
						} else {
							return result;
						}
					}
				}
			});
		return $elm$core$List$reverse(
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2(
					$terezka$line_charts$Internal$Utils$withFirst,
					alldata,
					F2(
						function (first, rest) {
							return A4(iterate, first, rest, dataBelowAll, _List_Nil);
						}))));
	});
var $terezka$line_charts$LineChart$stack = function (dataset) {
	var stackBelows = F2(
		function (dataset_, result) {
			if (dataset_.b) {
				var data = dataset_.a;
				var belows = dataset_.b;
				return A2(
					stackBelows,
					belows,
					A2(
						$elm$core$List$cons,
						A3($elm$core$List$foldl, $terezka$line_charts$LineChart$addBelows, data, belows),
						result));
			} else {
				return result;
			}
		});
	return $elm$core$List$reverse(
		A2(stackBelows, dataset, _List_Nil));
};
var $terezka$line_charts$Internal$Axis$variable = function (_v0) {
	var config = _v0;
	return config.bc;
};
var $terezka$line_charts$LineChart$toDataPoints = F2(
	function (config, lines) {
		var y = $terezka$line_charts$Internal$Axis$variable(config.cK);
		var x = $terezka$line_charts$Internal$Axis$variable(config.cI);
		var addPoint = function (datum) {
			var _v1 = _Utils_Tuple2(
				x(datum),
				y(datum));
			if (!_v1.a.$) {
				if (!_v1.b.$) {
					var x_ = _v1.a.a;
					var y_ = _v1.b.a;
					return $elm$core$Maybe$Just(
						A3(
							$terezka$line_charts$Internal$Data$Data,
							datum,
							A2($terezka$line_charts$Internal$Data$Point, x_, y_),
							true));
				} else {
					var x_ = _v1.a.a;
					var _v2 = _v1.b;
					return $elm$core$Maybe$Just(
						A3(
							$terezka$line_charts$Internal$Data$Data,
							datum,
							A2($terezka$line_charts$Internal$Data$Point, x_, 0),
							false));
				}
			} else {
				if (!_v1.b.$) {
					var _v3 = _v1.a;
					var y_ = _v1.b.a;
					return $elm$core$Maybe$Nothing;
				} else {
					var _v4 = _v1.a;
					var _v5 = _v1.b;
					return $elm$core$Maybe$Nothing;
				}
			}
		};
		var data = A2(
			$elm$core$List$map,
			A2(
				$elm$core$Basics$composeR,
				$terezka$line_charts$Internal$Line$data,
				$elm$core$List$filterMap(addPoint)),
			lines);
		var _v0 = config.bU;
		switch (_v0.$) {
			case 0:
				return data;
			case 1:
				return data;
			case 2:
				return $terezka$line_charts$LineChart$stack(data);
			default:
				return $terezka$line_charts$LineChart$normalize(
					$terezka$line_charts$LineChart$stack(data));
		}
	});
var $terezka$line_charts$Internal$Coordinate$Frame = F2(
	function (margin, size) {
		return {d2: margin, eb: size};
	});
var $terezka$line_charts$Internal$Coordinate$Size = F2(
	function (width, height) {
		return {c1: height, dH: width};
	});
var $terezka$line_charts$LineChart$Coordinate$Range = F2(
	function (min, max) {
		return {bL: max, bM: min};
	});
var $terezka$line_charts$Internal$Axis$Range$applyX = F2(
	function (range, system) {
		switch (range.$) {
			case 0:
				var padMin = range.a;
				var padMax = range.b;
				var _v1 = system;
				var frame = _v1.bJ;
				var _v2 = frame;
				var size = _v2.eb;
				var system_ = _Utils_update(
					system,
					{
						bJ: _Utils_update(
							frame,
							{
								eb: _Utils_update(
									size,
									{
										dH: A2($elm$core$Basics$max, 1, (size.dH - padMin) - padMax)
									})
							})
					});
				var scale = $terezka$line_charts$LineChart$Coordinate$scaleDataX(system_);
				return A2(
					$terezka$line_charts$LineChart$Coordinate$Range,
					system.cI.bM - scale(padMin),
					system.cI.bL + scale(padMax));
			case 1:
				var min = range.a;
				var max = range.b;
				return A2($terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.cI);
		}
	});
var $terezka$line_charts$Internal$Axis$Range$applyY = F2(
	function (range, system) {
		switch (range.$) {
			case 0:
				var padMin = range.a;
				var padMax = range.b;
				var _v1 = system;
				var frame = _v1.bJ;
				var _v2 = frame;
				var size = _v2.eb;
				var system_ = _Utils_update(
					system,
					{
						bJ: _Utils_update(
							frame,
							{
								eb: _Utils_update(
									size,
									{
										c1: A2($elm$core$Basics$max, 1, (size.c1 - padMin) - padMax)
									})
							})
					});
				var scale = $terezka$line_charts$LineChart$Coordinate$scaleDataY(system_);
				return A2(
					$terezka$line_charts$LineChart$Coordinate$Range,
					system.cK.bM - scale(padMin),
					system.cK.bL + scale(padMax));
			case 1:
				var min = range.a;
				var max = range.b;
				return A2($terezka$line_charts$LineChart$Coordinate$Range, min, max);
			default:
				var toRange = range.a;
				return toRange(system.cK);
		}
	});
var $terezka$line_charts$Internal$Coordinate$ground = function (range_) {
	return _Utils_update(
		range_,
		{
			bM: A2($elm$core$Basics$min, range_.bM, 0)
		});
};
var $terezka$line_charts$Internal$Area$hasArea = function (config) {
	switch (config.$) {
		case 0:
			return false;
		case 1:
			return true;
		case 2:
			return true;
		default:
			return true;
	}
};
var $terezka$line_charts$Internal$Axis$pixels = function (_v0) {
	var config = _v0;
	return config.a5;
};
var $terezka$line_charts$Internal$Axis$range = function (_v0) {
	var config = _v0;
	return config.a6;
};
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $terezka$line_charts$Internal$Coordinate$maximum = function (toValue) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(toValue),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$maximum,
			$elm$core$Maybe$withDefault(1)));
};
var $elm$core$List$minimum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$min, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $terezka$line_charts$Internal$Coordinate$minimum = function (toValue) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$map(toValue),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$minimum,
			$elm$core$Maybe$withDefault(0)));
};
var $terezka$line_charts$Internal$Coordinate$range = F2(
	function (toValue, data) {
		var range_ = {
			bL: A2($terezka$line_charts$Internal$Coordinate$maximum, toValue, data),
			bM: A2($terezka$line_charts$Internal$Coordinate$minimum, toValue, data)
		};
		return _Utils_eq(range_.bM, range_.bL) ? _Utils_update(
			range_,
			{bL: range_.bL + 1}) : range_;
	});
var $terezka$line_charts$LineChart$toSystem = F2(
	function (config, data) {
		var yRange = A2(
			$terezka$line_charts$Internal$Coordinate$range,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.d8;
				},
				function ($) {
					return $.cK;
				}),
			data);
		var xRange = A2(
			$terezka$line_charts$Internal$Coordinate$range,
			A2(
				$elm$core$Basics$composeR,
				function ($) {
					return $.d8;
				},
				function ($) {
					return $.cI;
				}),
			data);
		var size = A2(
			$terezka$line_charts$Internal$Coordinate$Size,
			$terezka$line_charts$Internal$Axis$pixels(config.cI),
			$terezka$line_charts$Internal$Axis$pixels(config.cK));
		var hasArea = $terezka$line_charts$Internal$Area$hasArea(config.bU);
		var container_ = A2($terezka$line_charts$Internal$Container$properties, $elm$core$Basics$identity, config.bW);
		var frame = A2($terezka$line_charts$Internal$Coordinate$Frame, container_.d2, size);
		var adjustDomainRange = function (domain) {
			return hasArea ? $terezka$line_charts$Internal$Coordinate$ground(domain) : domain;
		};
		var system = {
			bJ: frame,
			a3: container_.a3,
			cI: xRange,
			cJ: xRange,
			cK: adjustDomainRange(yRange),
			cL: yRange
		};
		return _Utils_update(
			system,
			{
				cI: A2(
					$terezka$line_charts$Internal$Axis$Range$applyX,
					$terezka$line_charts$Internal$Axis$range(config.cI),
					system),
				cK: A2(
					$terezka$line_charts$Internal$Axis$Range$applyY,
					$terezka$line_charts$Internal$Axis$range(config.cK),
					system)
			});
	});
var $terezka$line_charts$Internal$Axis$ticks = function (_v0) {
	var config = _v0;
	return config.aH;
};
var $terezka$line_charts$Internal$Axis$Tick$properties = function (_v0) {
	var properties_ = _v0;
	return properties_;
};
var $terezka$line_charts$Internal$Axis$Ticks$ticks = F3(
	function (dataRange, range, _v0) {
		var values = _v0;
		return A2(
			$elm$core$List$map,
			$terezka$line_charts$Internal$Axis$Tick$properties,
			A2(values, dataRange, range));
	});
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $terezka$line_charts$Internal$Svg$gridDot = F3(
	function (radius, color, point) {
		return A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$cx(
					$elm$core$String$fromFloat(point.cI)),
					$elm$svg$Svg$Attributes$cy(
					$elm$core$String$fromFloat(point.cK)),
					$elm$svg$Svg$Attributes$r(
					$elm$core$String$fromFloat(radius)),
					$elm$svg$Svg$Attributes$fill(
					$avh4$elm_color$Color$toCssString(color))
				]),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Grid$viewDots = F5(
	function (system, verticals, horizontals, radius, color) {
		var dot = F2(
			function (x, y) {
				return A2(
					$terezka$line_charts$LineChart$Coordinate$toSvg,
					system,
					A2($terezka$line_charts$LineChart$Coordinate$Point, x, y));
			});
		var dots_ = function (g) {
			return A2(
				$elm$core$List$map,
				dot(g),
				horizontals);
		};
		var alldots = A2($elm$core$List$concatMap, dots_, verticals);
		return A2(
			$elm$core$List$map,
			A2($terezka$line_charts$Internal$Svg$gridDot, radius, color),
			alldots);
	});
var $terezka$line_charts$Internal$Svg$horizontal = F5(
	function (system, userAttributes, y, x1, x2) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A3(
			$terezka$line_charts$Internal$Path$view,
			system,
			attributes,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Path$Move(
					{cI: x1, cK: y}),
					$terezka$line_charts$Internal$Path$Line(
					{cI: x1, cK: y}),
					$terezka$line_charts$Internal$Path$Line(
					{cI: x2, cK: y})
				]));
	});
var $terezka$line_charts$Internal$Svg$horizontalGrid = F3(
	function (system, userAttributes, y) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray)),
					$elm$svg$Svg$Attributes$style('pointer-events: none;')
				]),
			userAttributes,
			_List_Nil);
		return A5($terezka$line_charts$Internal$Svg$horizontal, system, attributes, y, system.cI.bM, system.cI.bL);
	});
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $terezka$line_charts$Internal$Grid$viewLines = F5(
	function (system, verticals, horizontals, width, color) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$strokeWidth(
				$elm$core$String$fromFloat(width)),
				$elm$svg$Svg$Attributes$stroke(
				$avh4$elm_color$Color$toCssString(color))
			]);
		return _Utils_ap(
			A2(
				$elm$core$List$map,
				A2($terezka$line_charts$Internal$Svg$horizontalGrid, system, attributes),
				horizontals),
			A2(
				$elm$core$List$map,
				A2($terezka$line_charts$Internal$Svg$verticalGrid, system, attributes),
				verticals));
	});
var $terezka$line_charts$Internal$Grid$view = F4(
	function (system, xAxis, yAxis, grid) {
		var hasGrid = function (tick) {
			return tick.b1 ? $elm$core$Maybe$Just(tick.bO) : $elm$core$Maybe$Nothing;
		};
		var horizontals = A2(
			$elm$core$List$filterMap,
			hasGrid,
			A3(
				$terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.cL,
				system.cK,
				$terezka$line_charts$Internal$Axis$ticks(yAxis)));
		var verticals = A2(
			$elm$core$List$filterMap,
			hasGrid,
			A3(
				$terezka$line_charts$Internal$Axis$Ticks$ticks,
				system.cJ,
				system.cI,
				$terezka$line_charts$Internal$Axis$ticks(xAxis)));
		if (!grid.$) {
			var radius = grid.a;
			var color = grid.b;
			return A5($terezka$line_charts$Internal$Grid$viewDots, system, verticals, horizontals, radius, color);
		} else {
			var width = grid.a;
			var color = grid.b;
			return A5($terezka$line_charts$Internal$Grid$viewLines, system, verticals, horizontals, width, color);
		}
	});
var $terezka$line_charts$Internal$Svg$End = 2;
var $terezka$line_charts$Internal$Svg$Start = 0;
var $terezka$line_charts$Internal$Svg$anchorStyle = function (anchor) {
	var anchorString = function () {
		switch (anchor) {
			case 0:
				return 'start';
			case 1:
				return 'middle';
			default:
				return 'end';
		}
	}();
	return $elm$svg$Svg$Attributes$style('text-anchor: ' + (anchorString + ';'));
};
var $terezka$line_charts$Internal$Legends$viewFree = F5(
	function (system, placement, viewLabel, line, data) {
		var _v0 = function () {
			if (!placement) {
				return _Utils_Tuple3(data, 2, -10);
			} else {
				return _Utils_Tuple3(
					$elm$core$List$reverse(data),
					0,
					10);
			}
		}();
		var orderedPoints = _v0.a;
		var anchor = _v0.b;
		var xOffset = _v0.c;
		var transform = function (_v3) {
			var x = _v3.cI;
			var y = _v3.cK;
			return $terezka$line_charts$Internal$Svg$transform(
				_List_fromArray(
					[
						A3($terezka$line_charts$Internal$Svg$move, system, x, y),
						A2($terezka$line_charts$Internal$Svg$offset, xOffset, 3)
					]));
		};
		var viewLegend = function (_v2) {
			var point = _v2.d8;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						transform(point),
						$terezka$line_charts$Internal$Svg$anchorStyle(anchor)
					]),
				_List_fromArray(
					[
						viewLabel(
						$terezka$line_charts$Internal$Line$label(line))
					]));
		};
		return A2(
			$terezka$line_charts$Internal$Utils$viewMaybe,
			$elm$core$List$head(orderedPoints),
			viewLegend);
	});
var $terezka$line_charts$Internal$Legends$viewFrees = F3(
	function (_v0, placement, view_) {
		var system = _v0.dA;
		var lines = _v0.ci;
		var data = _v0.bX;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__legends')
				]),
			A3(
				$elm$core$List$map2,
				A3($terezka$line_charts$Internal$Legends$viewFree, system, placement, view_),
				lines,
				data));
	});
var $terezka$line_charts$Internal$Line$shape = function (_v0) {
	var config = _v0;
	return config.dx;
};
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $elm$svg$Svg$Attributes$strokeOpacity = _VirtualDom_attribute('stroke-opacity');
var $terezka$line_charts$Internal$Dots$varietyAttributes = F2(
	function (color, variety) {
		switch (variety.$) {
			case 0:
				var width = variety.a;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke(
						$avh4$elm_color$Color$toCssString(color)),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$fill('white')
					]);
			case 2:
				var width = variety.a;
				var opacity = variety.b;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke(
						$avh4$elm_color$Color$toCssString(color)),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$strokeOpacity(
						$elm$core$String$fromFloat(opacity)),
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
			case 1:
				var width = variety.a;
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$stroke('white'),
						$elm$svg$Svg$Attributes$strokeWidth(
						$elm$core$String$fromInt(width)),
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
			default:
				return _List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(
						$avh4$elm_color$Color$toCssString(color))
					]);
		}
	});
var $terezka$line_charts$Internal$Dots$viewCircle = F5(
	function (events, variety, color, area, point) {
		var radius = $elm$core$Basics$sqrt(area / $elm$core$Basics$pi);
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$cx(
				$elm$core$String$fromFloat(point.cI)),
				$elm$svg$Svg$Attributes$cy(
				$elm$core$String$fromFloat(point.cK)),
				$elm$svg$Svg$Attributes$r(
				$elm$core$String$fromFloat(radius))
			]);
		return A2(
			$elm$svg$Svg$circle,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$pathPlus = F2(
	function (area, point) {
		var side = $elm$core$Basics$sqrt(area / 5);
		var r6 = side / 2;
		var r3 = side;
		var commands = _List_fromArray(
			[
				'M' + ($elm$core$String$fromFloat(point.cI - r6) + (' ' + $elm$core$String$fromFloat((point.cK - r3) - r6))),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(-r3),
				'h' + $elm$core$String$fromFloat(-r3),
				'v' + $elm$core$String$fromFloat(r3)
			]);
		return A2($elm$core$String$join, ' ', commands);
	});
var $terezka$line_charts$Internal$Dots$viewCross = F5(
	function (events, variety, color, area, point) {
		var rotation = 'rotate(45 ' + ($elm$core$String$fromFloat(point.cI) + (' ' + ($elm$core$String$fromFloat(point.cK) + ')')));
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathPlus, area, point)),
				$elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewDiamond = F5(
	function (events, variety, color, area, point) {
		var side = $elm$core$Basics$sqrt(area);
		var rotation = 'rotate(45 ' + ($elm$core$String$fromFloat(point.cI) + (' ' + ($elm$core$String$fromFloat(point.cK) + ')')));
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(point.cI - (side / 2))),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(point.cK - (side / 2))),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$transform(rotation)
			]);
		return A2(
			$elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewPlus = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathPlus, area, point))
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewSquare = F5(
	function (events, variety, color, area, point) {
		var side = $elm$core$Basics$sqrt(area);
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x(
				$elm$core$String$fromFloat(point.cI - (side / 2))),
				$elm$svg$Svg$Attributes$y(
				$elm$core$String$fromFloat(point.cK - (side / 2))),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(side)),
				$elm$svg$Svg$Attributes$height(
				$elm$core$String$fromFloat(side))
			]);
		return A2(
			$elm$svg$Svg$rect,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$core$Basics$tan = _Basics_tan;
var $terezka$line_charts$Internal$Dots$pathTriangle = F2(
	function (area, point) {
		var side = $elm$core$Basics$sqrt(
			(area * 4) / $elm$core$Basics$sqrt(3));
		var height = ($elm$core$Basics$sqrt(3) * side) / 2;
		var fromMiddle = height - (($elm$core$Basics$tan(
			$elm$core$Basics$degrees(30)) * side) / 2);
		var commands = _List_fromArray(
			[
				'M' + ($elm$core$String$fromFloat(point.cI) + (' ' + $elm$core$String$fromFloat(point.cK - fromMiddle))),
				'l' + ($elm$core$String$fromFloat((-side) / 2) + (' ' + $elm$core$String$fromFloat(height))),
				'h' + $elm$core$String$fromFloat(side),
				'z'
			]);
		return A2($elm$core$String$join, ' ', commands);
	});
var $terezka$line_charts$Internal$Dots$viewTriangle = F5(
	function (events, variety, color, area, point) {
		var attributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$d(
				A2($terezka$line_charts$Internal$Dots$pathTriangle, area, point))
			]);
		return A2(
			$elm$svg$Svg$path,
			_Utils_ap(
				events,
				_Utils_ap(
					attributes,
					A2($terezka$line_charts$Internal$Dots$varietyAttributes, color, variety))),
			_List_Nil);
	});
var $terezka$line_charts$Internal$Dots$viewShape = F5(
	function (system, _v0, shape, color, point) {
		var radius = _v0.cq;
		var variety = _v0.cG;
		var view_ = function () {
			switch (shape) {
				case 1:
					return $terezka$line_charts$Internal$Dots$viewCircle;
				case 2:
					return $terezka$line_charts$Internal$Dots$viewTriangle;
				case 3:
					return $terezka$line_charts$Internal$Dots$viewSquare;
				case 4:
					return $terezka$line_charts$Internal$Dots$viewDiamond;
				case 5:
					return $terezka$line_charts$Internal$Dots$viewCross;
				case 6:
					return $terezka$line_charts$Internal$Dots$viewPlus;
				default:
					return F5(
						function (_v2, _v3, _v4, _v5, _v6) {
							return $elm$svg$Svg$text('');
						});
			}
		}();
		var size = (2 * $elm$core$Basics$pi) * radius;
		var pointSvg = A2($terezka$line_charts$LineChart$Coordinate$toSvg, system, point);
		return A5(view_, _List_Nil, variety, color, size, pointSvg);
	});
var $terezka$line_charts$Internal$Dots$viewSample = F5(
	function (_v0, shape, color, system, data) {
		var config = _v0;
		var _v1 = config.ce(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.el;
				},
				data));
		var style_ = _v1;
		return A4($terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color);
	});
var $elm$svg$Svg$Attributes$fillOpacity = _VirtualDom_attribute('fill-opacity');
var $elm$svg$Svg$line = $elm$svg$Svg$trustedNode('line');
var $terezka$line_charts$Internal$Area$opacity = function (config) {
	switch (config.$) {
		case 0:
			return 0;
		case 1:
			var opacity_ = config.a;
			return opacity_;
		case 2:
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var $terezka$line_charts$Internal$Line$toAreaAttributes = F3(
	function (_v0, _v1, area) {
		var serie = _v0;
		var style_ = _v1;
		return _List_fromArray(
			[
				$elm$svg$Svg$Attributes$class('chart__interpolation__area__fragment'),
				$elm$svg$Svg$Attributes$fill(
				$avh4$elm_color$Color$toCssString(
					style_.cS(serie.cS)))
			]);
	});
var $elm$svg$Svg$Attributes$strokeDasharray = _VirtualDom_attribute('stroke-dasharray');
var $terezka$line_charts$Internal$Line$toSeriesAttributes = F2(
	function (_v0, _v1) {
		var serie = _v0;
		var style_ = _v1;
		return _List_fromArray(
			[
				$elm$svg$Svg$Attributes$style('pointer-events: none;'),
				$elm$svg$Svg$Attributes$class('chart__interpolation__line__fragment'),
				$elm$svg$Svg$Attributes$stroke(
				$avh4$elm_color$Color$toCssString(
					style_.cS(serie.cS))),
				$elm$svg$Svg$Attributes$strokeWidth(
				$elm$core$String$fromFloat(style_.dH)),
				$elm$svg$Svg$Attributes$strokeDasharray(
				A2(
					$elm$core$String$join,
					' ',
					A2($elm$core$List$map, $elm$core$String$fromFloat, serie.cU))),
				$elm$svg$Svg$Attributes$fill('transparent')
			]);
	});
var $terezka$line_charts$Internal$Utils$viewIf = F2(
	function (condition, view) {
		return condition ? view(0) : $elm$svg$Svg$text('');
	});
var $elm$svg$Svg$Attributes$x1 = _VirtualDom_attribute('x1');
var $elm$svg$Svg$Attributes$x2 = _VirtualDom_attribute('x2');
var $elm$svg$Svg$Attributes$y1 = _VirtualDom_attribute('y1');
var $elm$svg$Svg$Attributes$y2 = _VirtualDom_attribute('y2');
var $terezka$line_charts$Internal$Line$viewSample = F5(
	function (_v0, line_, area, data_, sampleWidth) {
		var look = _v0;
		var style_ = look(
			A2(
				$elm$core$List$map,
				function ($) {
					return $.el;
				},
				data_));
		var sizeAttributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x1('0'),
				$elm$svg$Svg$Attributes$y1('0'),
				$elm$svg$Svg$Attributes$x2(
				$elm$core$String$fromFloat(sampleWidth)),
				$elm$svg$Svg$Attributes$y2('0')
			]);
		var rectangleAttributes = _List_fromArray(
			[
				$elm$svg$Svg$Attributes$x('0'),
				$elm$svg$Svg$Attributes$y('0'),
				$elm$svg$Svg$Attributes$height('9'),
				$elm$svg$Svg$Attributes$width(
				$elm$core$String$fromFloat(sampleWidth))
			]);
		var lineAttributes = A2($terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_);
		var areaAttributes = A2(
			$elm$core$List$cons,
			$elm$svg$Svg$Attributes$fillOpacity(
				$elm$core$String$fromFloat(
					$terezka$line_charts$Internal$Area$opacity(area))),
			A3($terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area));
		var viewRectangle = function (_v1) {
			return A2(
				$elm$svg$Svg$rect,
				_Utils_ap(areaAttributes, rectangleAttributes),
				_List_Nil);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$line,
					_Utils_ap(lineAttributes, sizeAttributes),
					_List_Nil),
					A2(
					$terezka$line_charts$Internal$Utils$viewIf,
					$terezka$line_charts$Internal$Area$hasArea(area),
					viewRectangle)
				]));
	});
var $terezka$line_charts$Internal$Legends$viewSample = F4(
	function (_v0, sampleWidth, line, data) {
		var system = _v0.dA;
		var lineConfig = _v0.dc;
		var dotsConfig = _v0.cX;
		var area = _v0.bU;
		var shape = $terezka$line_charts$Internal$Line$shape(line);
		var dotPosition = A2(
			$terezka$line_charts$LineChart$Coordinate$toData,
			system,
			A2($terezka$line_charts$Internal$Data$Point, sampleWidth / 2, 0));
		var color = A3($terezka$line_charts$Internal$Line$color, lineConfig, line, data);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__sample')
				]),
			_List_fromArray(
				[
					A5($terezka$line_charts$Internal$Line$viewSample, lineConfig, line, area, data, sampleWidth),
					A6($terezka$line_charts$Internal$Dots$viewSample, dotsConfig, shape, color, system, data, dotPosition)
				]));
	});
var $terezka$line_charts$Internal$Legends$viewGrouped = F3(
	function (_arguments, sampleWidth, container) {
		var toLegend = F2(
			function (line, data) {
				return {
					c9: $terezka$line_charts$Internal$Line$label(line),
					ct: A4($terezka$line_charts$Internal$Legends$viewSample, _arguments, sampleWidth, line, data)
				};
			});
		var legends = A3($elm$core$List$map2, toLegend, _arguments.ci, _arguments.bX);
		return A2(container, _arguments.dA, legends);
	});
var $terezka$line_charts$Internal$Legends$view = function (_arguments) {
	var _v0 = _arguments.cf;
	switch (_v0.$) {
		case 1:
			var placement = _v0.a;
			var view_ = _v0.b;
			return A3($terezka$line_charts$Internal$Legends$viewFrees, _arguments, placement, view_);
		case 2:
			var sampleWidth = _v0.a;
			var container = _v0.b;
			return A3(
				$terezka$line_charts$Internal$Legends$viewGrouped,
				_arguments,
				sampleWidth,
				container(_arguments));
		default:
			return $elm$svg$Svg$text('');
	}
};
var $terezka$line_charts$Internal$Area$opacityContainer = function (config) {
	switch (config.$) {
		case 0:
			return 1;
		case 1:
			var opacity_ = config.a;
			return 1;
		case 2:
			var opacity_ = config.a;
			return opacity_;
		default:
			var opacity_ = config.a;
			return opacity_;
	}
};
var $terezka$line_charts$Internal$Utils$unzip3 = function (pairs) {
	var step = F2(
		function (_v0, _v1) {
			var a = _v0.a;
			var b = _v0.b;
			var c = _v0.c;
			var aas = _v1.a;
			var bs = _v1.b;
			var cs = _v1.c;
			return _Utils_Tuple3(
				A2($elm$core$List$cons, a, aas),
				A2($elm$core$List$cons, b, bs),
				A2($elm$core$List$cons, c, cs));
		});
	return A3(
		$elm$core$List$foldr,
		step,
		_Utils_Tuple3(_List_Nil, _List_Nil, _List_Nil),
		pairs);
};
var $elm$core$List$map3 = _List_map3;
var $terezka$line_charts$Internal$Line$viewNormal = function (_v0) {
	var areas = _v0.a;
	var lines = _v0.b;
	var dots = _v0.c;
	var view_ = F3(
		function (area_, line_, dots_) {
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__line')
					]),
				_List_fromArray(
					[area_, line_, dots_]));
		});
	return A4($elm$core$List$map3, view_, areas, lines, dots);
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $terezka$line_charts$Internal$Data$isWithinRange = F2(
	function (system, point) {
		return _Utils_eq(
			A3($elm$core$Basics$clamp, system.cI.bM, system.cI.bL, point.cI),
			point.cI) && _Utils_eq(
			A3($elm$core$Basics$clamp, system.cK.bM, system.cK.bL, point.cK),
			point.cK);
	});
var $terezka$line_charts$Internal$Utils$part = F4(
	function (isReal, points, current, parts) {
		part:
		while (true) {
			if (points.b) {
				var first = points.a;
				var rest = points.b;
				if (isReal(first)) {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _Utils_ap(
						current,
						_List_fromArray(
							[first])),
						$temp$parts = parts;
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				} else {
					var $temp$isReal = isReal,
						$temp$points = rest,
						$temp$current = _List_Nil,
						$temp$parts = A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							current,
							$elm$core$Maybe$Just(first)),
						parts);
					isReal = $temp$isReal;
					points = $temp$points;
					current = $temp$current;
					parts = $temp$parts;
					continue part;
				}
			} else {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(current, $elm$core$Maybe$Nothing),
					parts);
			}
		}
	});
var $terezka$line_charts$Internal$Interpolation$linear = $elm$core$List$map(
	$elm$core$List$map($terezka$line_charts$Internal$Path$Line));
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $terezka$line_charts$Internal$Interpolation$First = {$: 0};
var $terezka$line_charts$Internal$Interpolation$Previous = function (a) {
	return {$: 1, a: a};
};
var $terezka$line_charts$Internal$Interpolation$monotoneCurve = F4(
	function (point0, point1, tangent0, tangent1) {
		var dx = (point1.cI - point0.cI) / 3;
		return A3(
			$terezka$line_charts$Internal$Path$CubicBeziers,
			{cI: point0.cI + dx, cK: point0.cK + (dx * tangent0)},
			{cI: point1.cI - dx, cK: point1.cK - (dx * tangent1)},
			point1);
	});
var $terezka$line_charts$Internal$Interpolation$slope2 = F3(
	function (point0, point1, t) {
		var h = point1.cI - point0.cI;
		return (!(!h)) ? ((((3 * (point1.cK - point0.cK)) / h) - t) / 2) : t;
	});
var $terezka$line_charts$Internal$Interpolation$sign = function (x) {
	return (x < 0) ? (-1) : 1;
};
var $terezka$line_charts$Internal$Interpolation$toH = F2(
	function (h0, h1) {
		return (!h0) ? ((h1 < 0) ? (0 * (-1)) : h1) : h0;
	});
var $terezka$line_charts$Internal$Interpolation$slope3 = F3(
	function (point0, point1, point2) {
		var h1 = point2.cI - point1.cI;
		var h0 = point1.cI - point0.cI;
		var s0h = A2($terezka$line_charts$Internal$Interpolation$toH, h0, h1);
		var s0 = (point1.cK - point0.cK) / s0h;
		var s1h = A2($terezka$line_charts$Internal$Interpolation$toH, h1, h0);
		var s1 = (point2.cK - point1.cK) / s1h;
		var p = ((s0 * h1) + (s1 * h0)) / (h0 + h1);
		var slope = ($terezka$line_charts$Internal$Interpolation$sign(s0) + $terezka$line_charts$Internal$Interpolation$sign(s1)) * A2(
			$elm$core$Basics$min,
			A2(
				$elm$core$Basics$min,
				$elm$core$Basics$abs(s0),
				$elm$core$Basics$abs(s1)),
			0.5 * $elm$core$Basics$abs(p));
		return $elm$core$Basics$isNaN(slope) ? 0 : slope;
	});
var $terezka$line_charts$Internal$Interpolation$monotonePart = F2(
	function (points, _v0) {
		var tangent = _v0.a;
		var commands = _v0.b;
		var _v1 = _Utils_Tuple2(tangent, points);
		_v1$4:
		while (true) {
			if (!_v1.a.$) {
				if (_v1.b.b && _v1.b.b.b) {
					if (_v1.b.b.b.b) {
						var _v2 = _v1.a;
						var _v3 = _v1.b;
						var p0 = _v3.a;
						var _v4 = _v3.b;
						var p1 = _v4.a;
						var _v5 = _v4.b;
						var p2 = _v5.a;
						var rest = _v5.b;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						var t0 = A3($terezka$line_charts$Internal$Interpolation$slope2, p0, p1, t1);
						return A2(
							$terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								$elm$core$List$cons,
								p1,
								A2($elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								$terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var _v9 = _v1.a;
						var _v10 = _v1.b;
						var p0 = _v10.a;
						var _v11 = _v10.b;
						var p1 = _v11.a;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							$terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t1, t1),
										$terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _v1$4;
				}
			} else {
				if (_v1.b.b && _v1.b.b.b) {
					if (_v1.b.b.b.b) {
						var t0 = _v1.a.a;
						var _v6 = _v1.b;
						var p0 = _v6.a;
						var _v7 = _v6.b;
						var p1 = _v7.a;
						var _v8 = _v7.b;
						var p2 = _v8.a;
						var rest = _v8.b;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p2);
						return A2(
							$terezka$line_charts$Internal$Interpolation$monotonePart,
							A2(
								$elm$core$List$cons,
								p1,
								A2($elm$core$List$cons, p2, rest)),
							_Utils_Tuple2(
								$terezka$line_charts$Internal$Interpolation$Previous(t1),
								_Utils_ap(
									commands,
									_List_fromArray(
										[
											A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1)
										]))));
					} else {
						var t0 = _v1.a.a;
						var _v12 = _v1.b;
						var p0 = _v12.a;
						var _v13 = _v12.b;
						var p1 = _v13.a;
						var t1 = A3($terezka$line_charts$Internal$Interpolation$slope3, p0, p1, p1);
						return _Utils_Tuple2(
							$terezka$line_charts$Internal$Interpolation$Previous(t1),
							_Utils_ap(
								commands,
								_List_fromArray(
									[
										A4($terezka$line_charts$Internal$Interpolation$monotoneCurve, p0, p1, t0, t1),
										$terezka$line_charts$Internal$Path$Line(p1)
									])));
					}
				} else {
					break _v1$4;
				}
			}
		}
		return _Utils_Tuple2(tangent, commands);
	});
var $terezka$line_charts$Internal$Interpolation$monotoneSection = F2(
	function (points, _v0) {
		var tangent = _v0.a;
		var acc = _v0.b;
		var _v1 = function () {
			if (points.b) {
				var p0 = points.a;
				var rest = points.b;
				return A2(
					$terezka$line_charts$Internal$Interpolation$monotonePart,
					A2($elm$core$List$cons, p0, rest),
					_Utils_Tuple2(
						tangent,
						_List_fromArray(
							[
								$terezka$line_charts$Internal$Path$Line(p0)
							])));
			} else {
				return _Utils_Tuple2(tangent, _List_Nil);
			}
		}();
		var t0 = _v1.a;
		var commands = _v1.b;
		return _Utils_Tuple2(
			t0,
			A2($elm$core$List$cons, commands, acc));
	});
var $terezka$line_charts$Internal$Interpolation$monotone = function (sections) {
	return A3(
		$elm$core$List$foldr,
		$terezka$line_charts$Internal$Interpolation$monotoneSection,
		_Utils_Tuple2($terezka$line_charts$Internal$Interpolation$First, _List_Nil),
		sections).b;
};
var $terezka$line_charts$Internal$Interpolation$after = F2(
	function (a, b) {
		return _List_fromArray(
			[
				a,
				A2($terezka$line_charts$Internal$Data$Point, b.cI, a.cK),
				b
			]);
	});
var $terezka$line_charts$Internal$Interpolation$stepped = function (sections) {
	var expand = F2(
		function (result, section) {
			expand:
			while (true) {
				if (section.a.b) {
					if (section.a.b.b) {
						var _v1 = section.a;
						var a = _v1.a;
						var _v2 = _v1.b;
						var b = _v2.a;
						var rest = _v2.b;
						var broken = section.b;
						var $temp$result = _Utils_ap(
							result,
							A2($terezka$line_charts$Internal$Interpolation$after, a, b)),
							$temp$section = _Utils_Tuple2(
							A2($elm$core$List$cons, b, rest),
							broken);
						result = $temp$result;
						section = $temp$section;
						continue expand;
					} else {
						if (!section.b.$) {
							var _v3 = section.a;
							var last = _v3.a;
							var broken = section.b.a;
							return _Utils_ap(
								result,
								_List_fromArray(
									[
										A2($terezka$line_charts$Internal$Data$Point, broken.cI, last.cK)
									]));
						} else {
							var _v4 = section.a;
							var last = _v4.a;
							var _v5 = section.b;
							return result;
						}
					}
				} else {
					return result;
				}
			}
		});
	return A2(
		$elm$core$List$map,
		A2(
			$elm$core$Basics$composeR,
			expand(_List_Nil),
			$elm$core$List$map($terezka$line_charts$Internal$Path$Line)),
		sections);
};
var $terezka$line_charts$Internal$Interpolation$toCommands = F2(
	function (interpolation, data) {
		var pointsSections = $elm$core$List$map(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$mapFirst(
					$elm$core$List$map(
						function ($) {
							return $.d8;
						})),
				$elm$core$Tuple$mapSecond(
					$elm$core$Maybe$map(
						function ($) {
							return $.d8;
						}))));
		var points = $elm$core$List$map(
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Tuple$first,
				$elm$core$List$map(
					function ($) {
						return $.d8;
					})));
		switch (interpolation) {
			case 0:
				return $terezka$line_charts$Internal$Interpolation$linear(
					points(data));
			case 1:
				return $terezka$line_charts$Internal$Interpolation$monotone(
					points(data));
			default:
				return $terezka$line_charts$Internal$Interpolation$stepped(
					pointsSections(data));
		}
	});
var $terezka$line_charts$Internal$Area$opacitySingle = function (config) {
	switch (config.$) {
		case 0:
			return 0;
		case 1:
			var opacity_ = config.a;
			return opacity_;
		case 2:
			var opacity_ = config.a;
			return 1;
		default:
			var opacity_ = config.a;
			return 1;
	}
};
var $terezka$line_charts$Internal$Path$toPoint = function (command) {
	switch (command.$) {
		case 9:
			return A2($terezka$line_charts$LineChart$Coordinate$Point, 0, 0);
		case 0:
			var p = command.a;
			return p;
		case 1:
			var p = command.a;
			return p;
		case 2:
			var x = command.a;
			return A2($terezka$line_charts$LineChart$Coordinate$Point, x, 0);
		case 3:
			var y = command.a;
			return A2($terezka$line_charts$LineChart$Coordinate$Point, 0, y);
		case 4:
			var c1 = command.a;
			var c2 = command.b;
			var p = command.c;
			return p;
		case 5:
			var c1 = command.a;
			var p = command.b;
			return p;
		case 6:
			var c1 = command.a;
			var p = command.b;
			return p;
		case 7:
			var p = command.a;
			return p;
		default:
			var rx = command.a;
			var ry = command.b;
			var xAxisRotation = command.c;
			var largeArcFlag = command.d;
			var sweepFlag = command.e;
			var p = command.f;
			return p;
	}
};
var $terezka$line_charts$Internal$Utils$towardsZero = function (_v0) {
	var max = _v0.bL;
	var min = _v0.bM;
	return A3($elm$core$Basics$clamp, min, max, 0);
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $terezka$line_charts$Internal$Utils$last = function (list) {
	return $elm$core$List$head(
		A2(
			$elm$core$List$drop,
			$elm$core$List$length(list) - 1,
			list));
};
var $terezka$line_charts$Internal$Utils$lastSafe = F2(
	function (first, rest) {
		return A2(
			$elm$core$Maybe$withDefault,
			first,
			$terezka$line_charts$Internal$Utils$last(rest));
	});
var $terezka$line_charts$Internal$Utils$viewWithEdges = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A3(
				view,
				first,
				rest,
				A2($terezka$line_charts$Internal$Utils$lastSafe, first, rest));
		} else {
			return $elm$svg$Svg$text('');
		}
	});
var $elm$svg$Svg$Attributes$clipPath = _VirtualDom_attribute('clip-path');
var $terezka$line_charts$Internal$Svg$withinChartArea = function (_v0) {
	var id = _v0.a3;
	return $elm$svg$Svg$Attributes$clipPath(
		'url(#' + ($terezka$line_charts$Internal$Utils$toChartAreaId(id) + ')'));
};
var $terezka$line_charts$LineChart$Junk$withinChartArea = $terezka$line_charts$Internal$Svg$withinChartArea;
var $terezka$line_charts$Internal$Line$viewArea = F5(
	function (_v0, line_, style_, interpolation, data_) {
		var system = _v0.dA;
		var lineConfig = _v0.dc;
		var area = _v0.bU;
		var ground = function (point) {
			return A2(
				$terezka$line_charts$Internal$Data$Point,
				point.cI,
				$terezka$line_charts$Internal$Utils$towardsZero(system.cK));
		};
		var commands = F3(
			function (first, middle, last) {
				return A3(
					$terezka$line_charts$Internal$Utils$concat,
					_List_fromArray(
						[
							$terezka$line_charts$Internal$Path$Move(
							ground(
								$terezka$line_charts$Internal$Path$toPoint(first))),
							$terezka$line_charts$Internal$Path$Line(
							$terezka$line_charts$Internal$Path$toPoint(first))
						]),
					interpolation,
					_List_fromArray(
						[
							$terezka$line_charts$Internal$Path$Line(
							ground(
								$terezka$line_charts$Internal$Path$toPoint(last)))
						]));
			});
		var attributes = A2(
			$elm$core$List$cons,
			$terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fillOpacity(
					$elm$core$String$fromFloat(
						$terezka$line_charts$Internal$Area$opacitySingle(area))),
				A3($terezka$line_charts$Internal$Line$toAreaAttributes, line_, style_, area)));
		return A2(
			$terezka$line_charts$Internal$Utils$viewWithEdges,
			interpolation,
			F3(
				function (first, middle, last) {
					return A3(
						$terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A3(commands, first, middle, last));
				}));
	});
var $terezka$line_charts$Internal$Dots$view = F2(
	function (_v0, data) {
		var system = _v0.dA;
		var dotsConfig = _v0.cX;
		var shape = _v0.dx;
		var color = _v0.cS;
		var _v1 = dotsConfig;
		var config = _v1;
		var _v2 = config.ca(data.el);
		var style_ = _v2;
		return A5($terezka$line_charts$Internal$Dots$viewShape, system, style_, shape, color, data.d8);
	});
var $terezka$line_charts$Internal$Line$viewDot = F3(
	function (_arguments, _v0, _v1) {
		var lineConfig = _v0;
		var style_ = _v1;
		return $terezka$line_charts$Internal$Dots$view(
			{
				cS: style_.cS(lineConfig.cS),
				cX: _arguments.cX,
				dx: lineConfig.dx,
				dA: _arguments.dA
			});
	});
var $terezka$line_charts$Internal$Utils$viewWithFirst = F2(
	function (stuff, view) {
		if (stuff.b) {
			var first = stuff.a;
			var rest = stuff.b;
			return A2(view, first, rest);
		} else {
			return $elm$svg$Svg$text('');
		}
	});
var $terezka$line_charts$Internal$Line$viewSeries = F5(
	function (_v0, line_, style_, interpolation, data_) {
		var system = _v0.dA;
		var lineConfig = _v0.dc;
		var attributes = A2(
			$elm$core$List$cons,
			$terezka$line_charts$LineChart$Junk$withinChartArea(system),
			A2($terezka$line_charts$Internal$Line$toSeriesAttributes, line_, style_));
		return A2(
			$terezka$line_charts$Internal$Utils$viewWithFirst,
			data_,
			F2(
				function (first, _v1) {
					return A3(
						$terezka$line_charts$Internal$Path$view,
						system,
						attributes,
						A2(
							$elm$core$List$cons,
							$terezka$line_charts$Internal$Path$Move(first.d8),
							interpolation));
				}));
	});
var $terezka$line_charts$Internal$Line$viewSingle = F3(
	function (_arguments, line_, data_) {
		var style_ = function (_v1) {
			var look = _v1;
			return look(
				A2(
					$elm$core$List$map,
					function ($) {
						return $.el;
					},
					data_));
		}(_arguments.dc);
		var sections = A4(
			$terezka$line_charts$Internal$Utils$part,
			function ($) {
				return $.d1;
			},
			data_,
			_List_Nil,
			_List_Nil);
		var parts = A2($elm$core$List$map, $elm$core$Tuple$first, sections);
		var viewDots = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__dots')
				]),
			A2(
				$elm$core$List$map,
				A3($terezka$line_charts$Internal$Line$viewDot, _arguments, line_, style_),
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeL,
						$terezka$line_charts$Internal$Data$isWithinRange(_arguments.dA),
						function ($) {
							return $.d8;
						}),
					$elm$core$List$concat(parts))));
		var commands = A2($terezka$line_charts$Internal$Interpolation$toCommands, _arguments.cb, sections);
		var viewAreas = function (_v0) {
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__interpolation__area')
					]),
				A3(
					$elm$core$List$map2,
					A3($terezka$line_charts$Internal$Line$viewArea, _arguments, line_, style_),
					commands,
					parts));
		};
		var viewSeriess = A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__interpolation__line')
				]),
			A3(
				$elm$core$List$map2,
				A3($terezka$line_charts$Internal$Line$viewSeries, _arguments, line_, style_),
				commands,
				parts));
		return _Utils_Tuple3(
			A2(
				$terezka$line_charts$Internal$Utils$viewIf,
				$terezka$line_charts$Internal$Area$hasArea(_arguments.bU),
				viewAreas),
			viewSeriess,
			viewDots);
	});
var $terezka$line_charts$Internal$Line$viewStacked = F2(
	function (area, _v0) {
		var areas = _v0.a;
		var lines = _v0.b;
		var dots = _v0.c;
		var toList = F2(
			function (l, d) {
				return _List_fromArray(
					[l, d]);
			});
		var opacity = 'opacity: ' + $elm$core$String$fromFloat(
			$terezka$line_charts$Internal$Area$opacityContainer(area));
		var bottoms = $elm$core$List$concat(
			A3($elm$core$List$map2, toList, lines, dots));
		return _List_fromArray(
			[
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__bottoms'),
						$elm$svg$Svg$Attributes$style(opacity)
					]),
				areas),
				A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('chart__tops')
					]),
				bottoms)
			]);
	});
var $terezka$line_charts$Internal$Line$view = F3(
	function (_arguments, lines, datas) {
		var container = $elm$svg$Svg$g(
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__lines')
				]));
		var buildSeriesViews = ($terezka$line_charts$Internal$Area$opacityContainer(_arguments.bU) < 1) ? $terezka$line_charts$Internal$Line$viewStacked(_arguments.bU) : $terezka$line_charts$Internal$Line$viewNormal;
		return container(
			buildSeriesViews(
				$terezka$line_charts$Internal$Utils$unzip3(
					A3(
						$elm$core$List$map2,
						$terezka$line_charts$Internal$Line$viewSingle(_arguments),
						lines,
						datas))));
	});
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $terezka$line_charts$LineChart$viewBoxAttribute = function (_v0) {
	var frame = _v0.bJ;
	return $elm$svg$Svg$Attributes$viewBox(
		'0 0 ' + ($elm$core$String$fromFloat(frame.eb.dH) + (' ' + $elm$core$String$fromFloat(frame.eb.c1))));
};
var $terezka$line_charts$Internal$Axis$Line$config = function (_v0) {
	var config_ = _v0;
	return config_;
};
var $terezka$line_charts$Internal$Axis$Title$config = function (_v0) {
	var title = _v0;
	return title;
};
var $terezka$line_charts$Internal$Axis$Intersection$getY = function (_v0) {
	var func = _v0;
	return A2(
		$elm$core$Basics$composeL,
		function ($) {
			return $.cK;
		},
		func);
};
var $terezka$line_charts$Internal$Axis$attributesLine = F2(
	function (system, _v0) {
		var events = _v0.b$;
		var width = _v0.dH;
		var color = _v0.cS;
		return _Utils_ap(
			events,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$strokeWidth(
					$elm$core$String$fromFloat(width)),
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString(color)),
					$terezka$line_charts$Internal$Svg$withinChartArea(system)
				]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			$terezka$line_charts$Internal$Svg$horizontal,
			system,
			A2($terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.cD,
			config.cY);
	});
var $terezka$line_charts$Internal$Axis$attributesTick = function (_v0) {
	var width = _v0.dH;
	var color = _v0.cS;
	return _List_fromArray(
		[
			$elm$svg$Svg$Attributes$strokeWidth(
			$elm$core$String$fromFloat(width)),
			$elm$svg$Svg$Attributes$stroke(
			$avh4$elm_color$Color$toCssString(color))
		]);
};
var $terezka$line_charts$Internal$Axis$Tick$isPositive = function (direction) {
	if (direction === 1) {
		return true;
	} else {
		return false;
	}
};
var $terezka$line_charts$Internal$Axis$lengthOfTick = function (_v0) {
	var length = _v0.cg;
	var direction = _v0.bZ;
	return $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (-length) : length;
};
var $terezka$line_charts$Internal$Svg$Middle = 1;
var $terezka$line_charts$Internal$Axis$viewHorizontalLabel = F4(
	function (system, _v0, position, view) {
		var direction = _v0.bZ;
		var length = _v0.cg;
		var yOffset = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? ((-5) - length) : (15 + length);
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.cI, position.cK),
							A2($terezka$line_charts$Internal$Svg$offset, 0, yOffset)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(1)
				]),
			_List_fromArray(
				[view]));
	});
var $terezka$line_charts$Internal$Svg$xTick = F5(
	function (system, height, userAttributes, y, x) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y) + height))
				]));
		return A2($elm$svg$Svg$line, attributes, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalTick = F3(
	function (system, point, tick) {
		var x = point.cI;
		var y = point.cK;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					$terezka$line_charts$Internal$Svg$xTick,
					system,
					$terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					$terezka$line_charts$Internal$Axis$attributesTick(tick),
					y,
					x),
					A2(
					$terezka$line_charts$Internal$Utils$viewMaybe,
					tick.c9,
					A3($terezka$line_charts$Internal$Axis$viewHorizontalLabel, system, tick, point))
				]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontalTitle = F3(
	function (system, at, _v0) {
		var title = _v0.ee;
		var position = at(
			A2(title.bO, system.cJ, system.cI));
		var _v1 = title.M;
		var xOffset = _v1.a;
		var yOffset = _v1.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__title'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.cI, position.cK),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset + 15, yOffset + 5)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(0)
				]),
			_List_fromArray(
				[title.em]));
	});
var $terezka$line_charts$Internal$Axis$viewHorizontal = F3(
	function (system, intersection, _v0) {
		var config = _v0;
		var viewConfig = {
			cc: A2($terezka$line_charts$Internal$Axis$Intersection$getY, intersection, system),
			ch: A3($terezka$line_charts$Internal$Axis$Line$config, config.aZ, system.cJ, system.cI),
			aH: A3($terezka$line_charts$Internal$Axis$Ticks$ticks, system.cJ, system.cI, config.aH),
			ee: $terezka$line_charts$Internal$Axis$Title$config(config.ee)
		};
		var viewAxisLine = A2($terezka$line_charts$Internal$Axis$viewHorizontalAxisLine, system, viewConfig.cc);
		var at = function (x) {
			return {cI: x, cK: viewConfig.cc};
		};
		var viewTick = function (tick) {
			return A3(
				$terezka$line_charts$Internal$Axis$viewHorizontalTick,
				system,
				at(tick.bO),
				tick);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__axis--horizontal')
				]),
			_List_fromArray(
				[
					A3($terezka$line_charts$Internal$Axis$viewHorizontalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.ch),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2($elm$core$List$map, viewTick, viewConfig.aH))
				]));
	});
var $terezka$line_charts$Internal$Axis$Intersection$getX = function (_v0) {
	var func = _v0;
	return A2(
		$elm$core$Basics$composeL,
		function ($) {
			return $.cI;
		},
		func);
};
var $terezka$line_charts$Internal$Axis$viewVerticalAxisLine = F3(
	function (system, axisPosition, config) {
		return A5(
			$terezka$line_charts$Internal$Svg$vertical,
			system,
			A2($terezka$line_charts$Internal$Axis$attributesLine, system, config),
			axisPosition,
			config.cD,
			config.cY);
	});
var $terezka$line_charts$Internal$Axis$viewVerticalLabel = F4(
	function (system, _v0, position, view) {
		var direction = _v0.bZ;
		var length = _v0.cg;
		var xOffset = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? (5 + length) : ((-5) - length);
		var anchor = $terezka$line_charts$Internal$Axis$Tick$isPositive(direction) ? 0 : 2;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.cI, position.cK),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset, 5)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(anchor)
				]),
			_List_fromArray(
				[view]));
	});
var $terezka$line_charts$Internal$Svg$yTick = F5(
	function (system, width, userAttributes, x, y) {
		var attributes = A3(
			$terezka$line_charts$Internal$Utils$concat,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick'),
					$elm$svg$Svg$Attributes$stroke(
					$avh4$elm_color$Color$toCssString($terezka$line_charts$LineChart$Colors$gray))
				]),
			userAttributes,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$x1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x))),
					$elm$svg$Svg$Attributes$x2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgX, system, x) - width)),
					$elm$svg$Svg$Attributes$y1(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y))),
					$elm$svg$Svg$Attributes$y2(
					$elm$core$String$fromFloat(
						A2($terezka$line_charts$LineChart$Coordinate$toSvgY, system, y)))
				]));
		return A2($elm$svg$Svg$line, attributes, _List_Nil);
	});
var $terezka$line_charts$Internal$Axis$viewVerticalTick = F3(
	function (system, point, tick) {
		var x = point.cI;
		var y = point.cK;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__tick')
				]),
			_List_fromArray(
				[
					A5(
					$terezka$line_charts$Internal$Svg$yTick,
					system,
					$terezka$line_charts$Internal$Axis$lengthOfTick(tick),
					$terezka$line_charts$Internal$Axis$attributesTick(tick),
					x,
					y),
					A2(
					$terezka$line_charts$Internal$Utils$viewMaybe,
					tick.c9,
					A3($terezka$line_charts$Internal$Axis$viewVerticalLabel, system, tick, point))
				]));
	});
var $terezka$line_charts$Internal$Axis$viewVerticalTitle = F3(
	function (system, at, _v0) {
		var title = _v0.ee;
		var position = at(
			A2(title.bO, system.cL, system.cK));
		var _v1 = title.M;
		var xOffset = _v1.a;
		var yOffset = _v1.b;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__title'),
					$terezka$line_charts$Internal$Svg$transform(
					_List_fromArray(
						[
							A3($terezka$line_charts$Internal$Svg$move, system, position.cI, position.cK),
							A2($terezka$line_charts$Internal$Svg$offset, xOffset + 2, yOffset - 10)
						])),
					$terezka$line_charts$Internal$Svg$anchorStyle(2)
				]),
			_List_fromArray(
				[title.em]));
	});
var $terezka$line_charts$Internal$Axis$viewVertical = F3(
	function (system, intersection, _v0) {
		var config = _v0;
		var viewConfig = {
			cc: A2($terezka$line_charts$Internal$Axis$Intersection$getX, intersection, system),
			ch: A3($terezka$line_charts$Internal$Axis$Line$config, config.aZ, system.cL, system.cK),
			aH: A3($terezka$line_charts$Internal$Axis$Ticks$ticks, system.cL, system.cK, config.aH),
			ee: $terezka$line_charts$Internal$Axis$Title$config(config.ee)
		};
		var viewAxisLine = A2($terezka$line_charts$Internal$Axis$viewVerticalAxisLine, system, viewConfig.cc);
		var at = function (y) {
			return {cI: viewConfig.cc, cK: y};
		};
		var viewTick = function (tick) {
			return A3(
				$terezka$line_charts$Internal$Axis$viewVerticalTick,
				system,
				at(tick.bO),
				tick);
		};
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[
					$elm$svg$Svg$Attributes$class('chart__axis--vertical')
				]),
			_List_fromArray(
				[
					A3($terezka$line_charts$Internal$Axis$viewVerticalTitle, system, at, viewConfig),
					viewAxisLine(viewConfig.ch),
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$class('chart__ticks')
						]),
					A2($elm$core$List$map, viewTick, viewConfig.aH))
				]));
	});
var $terezka$line_charts$LineChart$viewCustom = F2(
	function (config, lines) {
		var junkLineInfo = function (line_) {
			return _Utils_Tuple3(
				A3($terezka$line_charts$Internal$Line$color, config.ch, line_, _List_Nil),
				$terezka$line_charts$Internal$Line$label(line_),
				$terezka$line_charts$Internal$Line$data(line_));
		};
		var getJunk = A3(
			$terezka$line_charts$Internal$Junk$getLayers,
			A2($elm$core$List$map, junkLineInfo, lines),
			$terezka$line_charts$Internal$Axis$variable(config.cI),
			$terezka$line_charts$Internal$Axis$variable(config.cK));
		var data = A2($terezka$line_charts$LineChart$toDataPoints, config, lines);
		var dataAll = $elm$core$List$concat(data);
		var dataSafe = A2(
			$elm$core$List$map,
			$elm$core$List$filter(
				function ($) {
					return $.d1;
				}),
			data);
		var dataAllSafe = $elm$core$List$concat(dataSafe);
		var system = A2($terezka$line_charts$LineChart$toSystem, config, dataAllSafe);
		var viewLines = $terezka$line_charts$Internal$Line$view(
			{bU: config.bU, cX: config.b_, cb: config.cb, dc: config.ch, dA: system});
		var viewLegends = $terezka$line_charts$Internal$Legends$view(
			{
				bU: config.bU,
				bX: dataSafe,
				cX: config.b_,
				cf: config.cf,
				dc: config.ch,
				ci: lines,
				dA: system,
				cI: $terezka$line_charts$Internal$Axis$variable(config.cI),
				cK: $terezka$line_charts$Internal$Axis$variable(config.cK)
			});
		var attributes = $elm$core$List$concat(
			_List_fromArray(
				[
					A2(
					$terezka$line_charts$Internal$Container$properties,
					function ($) {
						return $.dM;
					},
					config.bW),
					A3($terezka$line_charts$Internal$Events$toContainerAttributes, dataAll, system, config.b$),
					_List_fromArray(
					[
						$terezka$line_charts$LineChart$viewBoxAttribute(system)
					])
				]));
		var addGrid = $terezka$line_charts$Internal$Junk$addBelow(
			A4($terezka$line_charts$Internal$Grid$view, system, config.cI, config.cK, config.b1));
		var junk = addGrid(
			A2(getJunk, system, config.cd));
		return A4(
			$terezka$line_charts$LineChart$container,
			config,
			system,
			junk.b3,
			A2(
				$elm$svg$Svg$svg,
				attributes,
				_List_fromArray(
					[
						A2(
						$elm$svg$Svg$defs,
						_List_Nil,
						_List_fromArray(
							[
								$terezka$line_charts$LineChart$clipPath(system)
							])),
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('chart__junk--below')
							]),
						junk.bt),
						A2(viewLines, lines, data),
						A3($terezka$line_charts$LineChart$chartAreaPlatform, config, dataAll, system),
						A3($terezka$line_charts$Internal$Axis$viewHorizontal, system, config.cc, config.cI),
						A3($terezka$line_charts$Internal$Axis$viewVertical, system, config.cc, config.cK),
						viewLegends,
						A2(
						$elm$svg$Svg$g,
						_List_fromArray(
							[
								$elm$svg$Svg$Attributes$class('chart__junk--above')
							]),
						junk.bT)
					])));
	});
var $author$project$Main$ToggledResult = F2(
	function (a, b) {
		return {$: 10, a: a, b: b};
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $author$project$Main$viewResultItem = function (result) {
	return A2(
		$elm$html$Html$label,
		_List_fromArray(
			[
				$elm$html$Html$Events$onCheck(
				$author$project$Main$ToggledResult(result.bm.a3)),
				A2($elm$html$Html$Attributes$style, 'display', 'block')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$type_('checkbox'),
						$elm$html$Html$Attributes$checked(result.bw)
					]),
				_List_Nil),
				$elm$html$Html$text(
				$author$project$Main$propertiesToString(result.bm))
			]));
};
var $author$project$Main$viewResults = F2(
	function (results, hinted) {
		var enabledResults = A2(
			$elm$core$List$filter,
			function ($) {
				return $.bw;
			},
			results);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Results')
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2($elm$core$List$map, $author$project$Main$viewResultItem, results)),
					function () {
					if (!enabledResults.b) {
						return A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('no data')
								]));
					} else {
						return A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('update time (milliseconds)')
										])),
									A2(
									$terezka$line_charts$LineChart$viewCustom,
									$author$project$Main$dtChartConfig(hinted),
									A3($elm$core$List$map2, $author$project$Main$toSeries, enabledResults, $author$project$Main$colors)),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Note: 60 FPS is equivalent to 16.7 milliseconds per frame')
										])),
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('used heap size (bytes)')
										])),
									A2(
									$terezka$line_charts$LineChart$viewCustom,
									$author$project$Main$usedHeapSizeChartConfig(hinted),
									A3($elm$core$List$map2, $author$project$Main$toSeries, enabledResults, $author$project$Main$colors)),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Note: Memory profile is only available in Chrome. You need to run Chrome with the `--enable-precise-memory-info` argument.')
										])),
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('total heap size (bytes)')
										])),
									A2(
									$terezka$line_charts$LineChart$viewCustom,
									$author$project$Main$totalHeapSizeChartConfig(hinted),
									A3($elm$core$List$map2, $author$project$Main$toSeries, enabledResults, $author$project$Main$colors))
								]));
					}
				}(),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://github.com/harmboschloo/elm-ecs-benchmarks')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('code')
								]))
						]))
				]));
	});
var $author$project$Main$view = function (model) {
	return {
		dN: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				function () {
					var _v0 = model.aL.aG;
					if (!_v0.$) {
						return _List_fromArray(
							[
								A2($elm$html$Html$Lazy$lazy, $author$project$Main$viewInputs, model.aI),
								A3($elm$html$Html$Lazy$lazy2, $author$project$Main$viewResults, model.aI.a8, model.aI.bK)
							]);
					} else {
						return _List_fromArray(
							[
								$elm$html$Html$text('running...')
							]);
					}
				}())
			]),
		ee: 'elm-ecs-benchmarks'
	};
};
var $author$project$Main$main = $elm$browser$Browser$document(
	{dZ: $author$project$Main$init, ec: $author$project$Main$subscriptions, ek: $author$project$Main$update, em: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));