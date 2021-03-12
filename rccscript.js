/* RccScript version 0.4
 * http://rccmembers.web.fc2.com/public/rccscript/index.html
 * Copyright (c) 2009-2010 Riddle Creater's Community
 */

var RccScript = {
    // titleString + ページ番号 + titleSuffix がタイトルバーに表示されます。
    titleString: 'testRiddle ',
    titleSuffix: '',

    // 表示するページ番号の桁数。 1なら'1'、 2なら'01'、 3なら'001'のように表示(3桁まで)
    titleNumDigits: 1,

    // これをtrueにするとタイトルバーとrcc_pageNoの部分が全角数字になります。
    useFullwidthNum: false,

    // これをtrueにするとタイトルバーとrcc_pageNoの部分が漢数字になります。
    // (いまのところ九十九まで対応)
    useKanjiNum: false,

    // 答え入力欄 (rcc_input) のヨコ幅 (半角文字数)
    inputSize: 15,

    // 答え入力ボタン (rcc_button) のラベル
    goButtonLabel: 'Enter',

    // 1問目のファイル名 (rcc_entrance や rcc_start を使う場合は設定してください)
    startFileName: '01_start.html',

    // rcc_entranceのスタート用ボタンのラベル (rcc_entranceを使う場合は設定してください)
    startButtonLabel: 'START',

    // rcc_entranceのコンティニュー用ボタンのラベル (rcc_entranceを使う場合は設定してください)
    continueButtonLabel: 'つづきから',

    // rcc_clueのヒントボタン用のラベル (rcc_clueを使う場合は設定してください)
    clueButtonLabel: 'ヒント',

    // ヒントウィンドウの背景色と文字色を16進数RGB値やカラーネームで指定
    clueWindowColor: '#000000',
    clueFontColor: '#ffffff',

    // ヒントウィンドウの半透明化 trueなら半透明 falseなら不透明
    useTransparentWindow: true,

    // これをtrueにするとclass="movable"指定した要素がドラッグ可能になります。
    // 使わない場合は false にしておいた方が読み込みが多少軽くなります (多分)。
    useMovable: true,

    // class="movable"が指定されているかどうか調べる要素名 (タグ名) を指定。
    // 例えばimg要素だけを調べる場合は'img'を指定します。
    // '*'を指定するとすべての要素を調べます (HTMLが複雑な場合は時間がかかるかも)。
    scanTagName: 'img',

    // これは弄らずそのままで
    version: '0.4',

    // 各問題の遷移先のHTML名
    riddle2: '02_1',
    riddle3: '03_3',
    riddle4: '04_R',
    riddle5: '05_APPLE',
    riddle6: '06_0',
    riddle7: '07_OTSUKARESAMA'
};

/*-----------------------------------------------------------------------------*/
RccScript.isIE = !!(window.attachEvent && navigator.userAgent.indexOf('Opera') === -1);
RccScript.pageNum = -1;
// Functions
RccScript.init = function() {
    var filename = getFileName();
    RccScript.pageNum = getPageNum(filename);
    RccScript.setTitle(RccScript.pageNum);
    RccScript.setForm();
    RccScript.setClue();
    RccScript.setEntrance();

    if (document.getElementById('rcc_deleteCookie')) {
        RccScript.deleteCookie('contfilename');
    } else if (!document.getElementById('rcc_continue')
               && !document.getElementById('rcc_noCookie')) {
	var cfilename = RccScript.getCookie('contfilename');
	if (cfilename) {
	    var cnum = getPageNum(cfilename);
	    if (cnum <= RccScript.pageNum) {
		RccScript.setCookie('contfilename', filename);
	    }
	} else {
            RccScript.setCookie('contfilename', filename);
	}
    }
    if (RccScript.useMovable) {
        RccMovable.init(RccScript.scanTagName);
    }

    function getFileName() {
	var loc = window.location.href;
	var idx = loc.lastIndexOf( '/' );
	if (idx == -1) return '';
	return loc.slice(idx + 1);
    }

    function getPageNum(fname) {
	var idx = fname.indexOf( '_' );
	if (idx == -1) return -1;
	var num = parseInt(fname.slice(0, idx), 10);
	return (isNaN(num)) ? -1 : num;
    }
};

RccScript.setTitle = function(pageNum) {
    var numString;
    if (pageNum == -1) {
	numString = '';
    } else {
	if (RccScript.useKanjiNum) {
	    numString = getKanjiNum(pageNum);
	} else {
	    numString = RccScript.getFixedNumber(pageNum, RccScript.titleNumDigits);
	    if (RccScript.useFullwidthNum) {
		numString = toFullwidth(numString);
	    }
	}
    }
    if (document.title == '' || document.title == String.fromCharCode(0xA0)) {
        document.title = RccScript.titleString + numString + RccScript.titleSuffix;
    }
    var element = document.getElementById('rcc_pageNo');
    if (element) {
        element.innerHTML = numString;
    }

    function getKanjiNum(num) {
	// とりあえず99まで対応
	var kanjiNum = '〇一二三四五六七八九';
	var result = '';
	if (num > 9) {
            var tenths = Math.floor(num / 10);
            if (tenths > 1) {
		result += kanjiNum.charAt(tenths);
            }
            result += '十';
            num = num - tenths * 10;
            if (num == 0) {
		return result;
            }
	}
	var c = kanjiNum.charAt(num);
	result += c;
	return result;
    }

    function toFullwidth(str) {
	var wide = ['０','１','２','３','４','５','６','７','８','９'];
	var result = '';
	for (var i = 0; i < str.length; i++){
	    result += wide[str.charAt(i)];
	}
	return result;
    }
};

RccScript.setForm = function() {
    var element = document.getElementById('rcc_form');
    var input = document.getElementById('rcc_input');
    var button = document.getElementById('rcc_button');
    if (element) {  // id名が「rcc_form」となっている要素がHTML上にある場合
        if (!input) {   // id名が「rcc_input」となっている要素がHTML上にない場合
        input = document.createElement('input'); // <input></input>
	    input.id = 'rcc_input'; // <input id='rcc_input'></input>
	    input.type = 'text';    // <input id='rcc_input' type='text'></input>
	    input.size = RccScript.inputSize;   // <input id='rcc_input' type='text' size=15></input>
	    element.appendChild(input);     // elementの子要素としてinputを追加する
	    element.appendChild(document.createTextNode(' '));  // elementの子要素としてテキスト値「' '」を追加する
        }
        if (!button) {
	    button = document.createElement('button');  // <button></button>
	    button.id = 'rcc_button';   //<button id='rcc_button'></button>
	    if (!RccScript.isIE) { // 何故かIEだとエラーになるので
                button.type = 'button'; //<button id='rcc_button' type='button'></button>
	    }
	    button.innerHTML = RccScript.goButtonLabel; // <button id='rcc_button' type='button'>Enter</button>
	    element.appendChild(button);
        }
    }
    if (input) {
        RccScript.addListener(input, 'keypress', RccScript.checkEnter, false);
    }
    if (button) {
        RccScript.addListener(button, 'click', RccScript.goNext, false);
    }
};

RccScript.setClue = function() {
    var element = document.getElementById('rcc_clue');
    if (!element) return;
    var message = element.innerHTML;
    if (message.search(/\S/) == -1) return;
    /* window */
    var win = document.createElement('div');
    win.id = 'rcc_window';
    win.className = 'movable';
    if (RccScript.clueWindowColor) {
	win.style.backgroundColor = RccScript.clueWindowColor;
    } else {
	win.style.backgroundColor = '#000000';
    }
    if (RccScript.clueFontColor) {
	win.style.color = RccScript.clueFontColor;
    } else {
	win.style.color = '#ffffff';
    }
    if (RccScript.useTransparentWindow) {
	if (RccScript.isIE) {
	    // IEのバグ回避用
	    win.style.zoom = '1';
	}
	win.style.filter = 'alpha(opacity=80)';
	win.style.opacity = 0.8;
	//mozOpacity = 0.8;
    }
    win.style.position = 'absolute';
    win.style.border = '1px solid #666666';
    win.style.top = '0px';
    win.style.left = '0px';
    win.style.visibility = 'hidden';
    var head = document.createElement('div');
    head.style.textAlign = 'right';
    var close_button = document.createElement('button');
    close_button.innerHTML = 'close';
    close_button.style.color = RccScript.clueFontColor;
    close_button.style.fontSize = '10px';
    close_button.style.backgroundColor = 'transparent';
    close_button.style.border = '1px solid ' + RccScript.clueFontColor;
    close_button.style.padding = '1px';
    close_button.style.margin = '1px';
    close_button.style.cursor = 'pointer';
    if (!RccScript.isIE) {
        // 何故かIEだとエラーになるので
        close_button.type = 'button';
    }
    RccScript.addListener(close_button, 'click', RccScript.closeWindow, false);
    head.appendChild(close_button);
    var content = document.createElement('div');
    content.innerHTML = message;
    content.style.padding = '0.5em 1em 1em';
    win.appendChild(head);
    win.appendChild(content);
    /* clue_button */
    var clue_button = document.createElement('button');
    clue_button.innerHTML = RccScript.clueButtonLabel;
    if (!RccScript.isIE) {
        // 何故かIEだとエラーになるので
        clue_button.type = 'button';
    }
    RccScript.addListener(clue_button, 'click', RccScript.openWindow, false);
    element.innerHTML = '';
    element.appendChild(clue_button);
    win.style.cursor = 'move';
    RccScript.addListener(win, 'mousedown', RccMovable.startDrag, false);
    element.appendChild(win);
};

RccScript.setEntrance = function() {
    var element = document.getElementById('rcc_entrance');
    var st_button = document.getElementById('rcc_start');
    //var ct_button = document.getElementById('rcc_continue');
    if (element) {
        if (!st_button) {
	    st_button = document.createElement('button');
        st_button.id = 'rcc_start';
        st_button.className = 'rcc_start';
	    if (!RccScript.isIE) {
                st_button.type = 'button';
	    }
	    st_button.innerHTML = RccScript.startButtonLabel;
	    element.appendChild(st_button);
	    element.appendChild(document.createTextNode(' '));
        }
        /*if (!ct_button) {
	    ct_button = document.createElement('button');
	    ct_button.id = 'rcc_continue';
	    if (!RccScript.isIE) {
                ct_button.type = 'button';
	    }
	    ct_button.innerHTML = RccScript.continueButtonLabel;
	    element.appendChild(ct_button);
        }*/
    }
    if (st_button) {
        RccScript.addListener(st_button, 'click', RccScript.startGame, false);
    }
    /*if (ct_button) {
        RccScript.addListener(ct_button, 'click', RccScript.continueGame, false);
	if (!navigator.cookieEnabled) {
	    if (!element) {
		element = ct_button.parentNode;
	    }
	    element.appendChild(document.createElement('br'));
	    var text = document.createTextNode('Cookieが無効になっています。');
	    element.appendChild(text);
	    text = document.createTextNode('無効のままだと「' + RccScript.continueButtonLabel + '」ボタンは使えません。');
	    element.appendChild(document.createElement('br'));
	    element.appendChild(text);
	}
        if (!RccScript.getCookie('contfilename')) {
	    ct_button.disabled = 'disabled';
        }
    }*/
};

RccScript.goNext = function() {
    var answer = document.getElementById('rcc_input').value;    // 入力欄に入力された値を取得
    if (answer == '') {
	return;
    } else if (answer == 'rcc_version') {
	document.getElementById('rcc_input').value = RccScript.version;
	return;
    }
    answer = RccScript.shapeAnswer(answer); // 入力された値をshapeAnswerクラスで成型
    if (answer == '') return;
    var prefix = (RccScript.pageNum == -1) ? '' : 
        RccScript.getFixedNumber(RccScript.pageNum + 1, 2) + '_';
    if (self != top) {  // フレーム分割されているとき、現在のページがフレーム分割のトップでない場合
        top.location.href = prefix + answer + '.html';
    } else if(prefix + answer == RccScript.riddle2
    || prefix + answer == RccScript.riddle3
    || prefix + answer == RccScript.riddle4
    || prefix + answer == RccScript.riddle5
    || prefix + answer == RccScript.riddle6
    || prefix + answer == RccScript.riddle7){
        window.location.href = prefix + answer + '.html';
    }else{
        window.location.href = '99_hazure.html';
    }
};

RccScript.checkEnter = function(e) {
    if (e.keyCode == 13) RccScript.goNext();
};

RccScript.shapeAnswer = function(word) {
    word = toHalfwidth(word);         // 全角→半角
    word = k2r(word);                 // ひらがなカタカナ→ローマ字
    word = trim1(word);               // 記号やスペース等を除去
    word = encodeURI(word);           // 漢字→英字列にエンコード Unicode UTF-8(?)
    word = trim2(word.toUpperCase()); // 英数字以外を除去 toUpperCaseメソッドで小文字を大文字に変換
    return word;

    function trim1(word) {
        var ignored = ' "%<>[]\\^`{}|';
        var result = '';
        for (var i = 0; i < word.length; i++) {
            var c = word.charAt(i);
            if (ignored.indexOf(c, 0) != -1)
                continue;
            result += c;
        }
        return result;
    }

    function trim2(word) {
        var valid = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = 0; i < word.length; i++) {
            var c = word.charAt(i); //文字列の指定した位置にある文字を取得する（charAt）
            if (valid.indexOf(c, 0) == -1) //文字列を先頭から検索する（indexOf） 見つからない場合は-1を返す
                continue;
            result += c;
        }
        return result;
    }

    function toHalfwidth(word) {
        var half = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var wide = '０１２３４５６７８９ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ';
        var ignored = '　！”＃＄％＆’（）ー＝＾?￥｜＠‘「｛；＋：＊」｝、＜．＞／？＿、。・';

        var result = '';
        for (var i = 0; i < word.length; i++) {
            var c = word.charAt(i); //文字列の指定した位置にある文字を取得する（charAt）
            var idx = wide.indexOf(c); //文字列を先頭から検索する（indexOf） 見つからない場合は-1を返す
            if (idx != -1) //wide（全角文字）を検索して見つかれば
                c = half.charAt(idx); //idx番目の半角文字
            if (ignored.indexOf(c) != -1)
                continue;
            result += c;
        }
        return result;
    }

    function k2r(word) {
        var KANA = 'アイウエオヲンあいうえおをん';
        var ROMA = 'aiueoon';
        var KANA2 = 'カキクケコサスセソタテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポかきくけこさすせそたてとなにぬねのはひふへほまみむめもやゆよらりるれろわがぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ';
        var ROMA2 = 'kakikukekosasusesotatetonaninunenohahifuhehomamimumemoyayuyorarirurerowagagigugegozajizuzezodajizudedobabibubebopapipupepo';
        var KANA3 = 'シチツしちつ';
        var ROMA3 = 'shichitsu';
        var KANA4 = 'ャュョゃゅょ';
        var ROMA4 = 'auo';
        var KANA5 = 'ァィゥェォぁぃぅぇぉ';
        var ROMA5 = 'aiueo';
        var result = '';
        var xtu = false;
        var prevchar = '';
        for (var i = 0, len = word.length; i < len; i++) {
            var ch = word.charAt(i);
            var rch = '';
            if (KANA.indexOf(ch,0) != -1) {
                var idx = KANA.indexOf(ch,0) % ROMA.length;
                rch = ROMA.charAt(idx);
                if (result.charAt(result.length-1) == rch && rch != 'i') {
                    rch = '';
                } else if ( rch == 'u' && result.charAt(result.length-1) == 'o') {
                    rch = '';
                }
            } else if (KANA2.indexOf(ch,0) != -1) {
                var idx = KANA2.indexOf(ch,0) % 61 * 2;
                rch = ROMA2.substr(idx,2);
                if ('bmp'.indexOf(rch.charAt(0),0) != -1
                    && (prevchar == 'ン' || prevchar == 'ん')) {
                    result = result.slice(0, -1) + 'm';
                }
            } else if (KANA3.indexOf(ch,0) != -1) {
                var idx = KANA3.indexOf(ch,0) % 3 * 3;
                rch = ROMA3.substr(idx,3);
            } else if (KANA4.indexOf(ch,0) != -1) {
                var idx = KANA4.indexOf(ch,0) % 3;
                rch = ROMA4.charAt(idx);
                if ('シチジヂしちじぢ'.indexOf(prevchar,0) == -1) {
                    rch = 'y' + rch;
                }
                result = result.slice(0, -1);
            } else if (KANA5.indexOf(ch,0) != -1) {
                var idx = KANA5.indexOf(ch,0) % 5;
                rch = ROMA5.charAt(idx);
                if ('フふヴ'.indexOf(prevchar,0) != -1
                    || ('テデてで'.indexOf(prevchar,0) != -1 && rch == 'i')
                    || ('シチジヂしちじぢ'.indexOf(prevchar,0) != -1 && rch == 'e')) {
                    result = result.slice(0, -1);
                } else {
                    if ('ウう'.indexOf(prevchar,0) != -1) {
                        rch = 'w' + rch;
                        result = result.slice(0, -1);
                    } else {
                        rch = 'x' + rch;
                    }
                }
            } else if (ch == 'ッ' || ch == 'っ') {
                xtu = true;
                continue;
            } else if (ch == 'ヴ') {
                rch = 'vu';
            } else {
                rch = ch;
            }
            if (xtu) {
                if( rch.charAt(0) == "c") {
                    rch = 't' + rch;
                } else {
                    rch = rch.charAt(0) + rch;
                }
                xtu =false;
            }
            prevchar = ch;
            result += rch;
        }
        return result;
    }
};

RccScript.startGame = function() {
    if (RccScript.getCookie('contfilename')) {
	var ret = confirm('保存されたデータがあります。\n削除してから進む場合は「OK」を\n削除せずに進む場合は「キャンセル」を押して下さい。');
	if (ret) RccScript.deleteCookie('contfilename');
    }
    var filename = RccScript.startFileName;
    if (filename) {
        window.location.href= filename;
    } else {
	alert('RccScript.startFileNameを設定してください。');
    }
};

RccScript.continueGame = function() {
    var filename = RccScript.getCookie('contfilename');
    if (filename) {
        window.location.href= filename;
    }
};

RccScript.getCookie = function(key) {
    var cks = document.cookie.split('; ');
    for (var i = 0; i < cks.length; i++) {
        var vals = cks[i].split('=');
        if (vals[0] == key)
	    return decodeURIComponent(vals[1]);
    }
    return null;
};

RccScript.setCookie = function(key, value) {
    var exp = new Date();
    exp.setFullYear(exp.getFullYear() + 1);
    document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) +'; expires=' + exp.toGMTString() + ';' ;
};

RccScript.deleteCookie = function(key) {
    var exp = new Date();
    exp.setFullYear(exp.getFullYear() - 1);
    document.cookie = encodeURIComponent(key) + '=; expires=' + exp.toGMTString() + ';' ;
};

RccScript.addListener = function(obj, type, func, cap) {
    if (obj.addEventListener) {
        obj.addEventListener(type, func, cap);
    } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, func);
    } else {
        obj['on' + type] = func;
    }
};

RccScript.removeListener = function(obj, type, func, cap) {
    if (obj.removeEventListener) {
        obj.removeEventListener(type, func, cap);
    } else if (obj.detachEvent) {
        obj.detachEvent('on' + type, func);
    } else {
	obj['on' + type] = null;
    }
};

RccScript.openWindow = function(e) {
    var scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    var win = document.getElementById('rcc_window');
    win.style.top = (scrollTop + e.clientY - 20)+ 'px';
    win.style.left = (e.clientX + 20) + 'px';
    win.style.visibility = 'visible';
};

RccScript.closeWindow = function(e) {
    var win = document.getElementById('rcc_window');
    win.style.visibility = 'hidden';
};

RccScript.getFixedNumber = function(num, digits) {
    if (digits > 3) digits = 3;
    num = num.toString();
    if (num.length > digits) digits = num.length;
    var str = '00' + num;
    return str.slice(-digits);
};

// RccMovable
var RccMovable = {
    zindex: 0,
    init: function(scanTagName) {
	if (arguments.length == 0) {
	    scan('*');
	} else if (arguments.length == 1) {
	    scan(scanTagName);
	} else {
	    for (var i = 0; i < arguments.length; i++) {
		scan(arguments[i]);
	    }
	}

	function scan(tagName) {
	    var elements;
	    if (tagName == '*') {
		elements = (document.all) ? document.all : document.getElementsByTagName('*');
	    } else {
		elements = document.getElementsByTagName(tagName);
	    }
            for (var i = 0, len = elements.length; i < len; i++) {
		if (elements[i].className.indexOf('movable') != -1) {
                    var element = elements[i];
                    var style = (element.currentStyle) ? element.currentStyle : document.defaultView.getComputedStyle(element, null);
                    if (style.position == 'static') {
			element.style.position = 'relative';
                    }
                    var top = parseInt(style.top);
                    var left = parseInt(style.left);
                    element.style.top = (isNaN(top)) ? '0px' : top + 'px';
                    element.style.left = (isNaN(left)) ? '0px' : left + 'px';
                    element.style.cursor = 'move';
                    RccScript.addListener(element, 'mousedown', RccMovable.startDrag, false);
		}
            }
	}
    }
};

RccMovable.startDrag = function(e) {
    var obj;
    if (e.target) {
        obj = e.target;
    } else if (e.srcElement) {
        obj = e.srcElement;
    }
    if (obj.nodeType == 3) {// defeat Safari bug
        obj = obj.parentNode;
    }
    while (obj.className.indexOf('movable') == -1) {
	obj = obj.parentNode;
	if (!obj) return false;
    }
    var left_diff = e.clientX - parseInt(obj.style.left);
    var top_diff = e.clientY - parseInt(obj.style.top);
    RccScript.addListener(document, 'mousemove', moveobj, false);
    RccScript.addListener(document, 'mouseup', release, false);
    obj.style.zIndex = ++RccMovable.zindex;
    stopEvent(e);
    return false;

    function moveobj(e) {
	if (!e) e = window.event;
        obj.style.top = (e.clientY - top_diff) + 'px';
        obj.style.left = (e.clientX - left_diff) + 'px';
        stopEvent(e);
        return false;
    }

    function release(e) {
        if (!e) e = window.event;
        RccScript.removeListener(document, 'mousemove', moveobj, false);
        RccScript.removeListener(document, 'mouseup', release, false);
        obj = null;
    }

    function stopEvent(e) {
        // バブリングフェーズのイベント伝播を阻止
        if (e.stopPropagation) {
            e.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
        // デフォルトイベントを抑止
        if (e.preventDefault) {
            e.preventDefault();
        } else if (window.event) {
            window.event.returnValue = false;
        }
    }
};

RccScript.addListener(window, 'load', RccScript.init, false);
