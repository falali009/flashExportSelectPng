//导出所选到png v1.4
//将flash所选内容保存为png
//  素材将保存到脚本目录下的 JSFL 文件夹里
//根据代码出处改写 https://github.com/hufang360/FlashTool
//	支持将素材放大导出

//将保存位置设置为脚本同目录下的 JSFL 文件夹
var folder = getFolder(fl.scriptURI) + "JSFL/"
FLfile.createFolder(folder);

start();
function start() {
	//打开的文档
	var doc = fl.getDocumentDOM();
	if (!doc) {
		alert("请打开fla文档");
		return;
	}

	//判断是否有所选内容
	if (doc.selection.length == 0) {
		alert("请在舞台选择一个元素");
		return;
	}

	var inputRate = prompt("请输入放大倍数", 1)
	if(inputRate==null) return
	inputRate = parseFloat(inputRate)
	if (!inputRate) inputRate = 1


	// alert(doc.selection);

	var theElems = doc.selection;
	for (var c = 0; c < theElems.length; c++) {

		//获取选中的元件名称
		var eleName = "";
		// if (doc.selection.length == 1) {
		// var ele = doc.selection[0];
		if (theElems[c].elementType == "instance") {
			doc.library.selectItem(theElems[c].libraryItem.name);
			doc.library.addItemToDocument({ x: 0, y: 0 });


			doc.clipCut();
			//创建新文档
			var exportDoc = fl.createDocument();
			exportDoc.clipPaste();
			exportDoc.selectAll();

			// 转成元件 并进行缩放
			exportDoc.convertToSymbol("graphic", "eClip", "top left")
			var clip = exportDoc.selection[0];
			clip.scaleX = inputRate;
			clip.scaleY = inputRate;

			//将元件转成位图，解决边界计算比实际略小的情况
			exportDoc.convertSelectionToBitmap();

			//设置舞台大小 将图片尺寸调整为偶数
			var bm = exportDoc.selection[0];
			bm.x = 0;
			bm.y = 0;
			bmW = Math.ceil(bm.width);
			bmH = Math.ceil(bm.height);
			bmW = bmW % 2 == 0 ? bmW : bmW + 1
			bmH = bmH % 2 == 0 ? bmH : bmH + 1
			exportDoc.width = bmW;
			exportDoc.height = bmH;
			// exportdoc = fl.createDocument();
			// exportdoc.clipPaste();
			// exportdoc.selectAll();
			// exportdoc.width = Math.floor(theElems[c].width);
			// exportdoc.height = Math.floor(theElems[c].height);
			// exportdoc.moveSelectionBy({ x: - exportdoc.selection[0].left, y: - exportdoc.selection[0].top });
			exportdoc.selectNone();
			var pngName = folder + theElems[c].name + "_" + theElems[c].left + "_" + theElems[c].top + ".png";
			exportdoc.exportPNG(pngName, true, true);
			exportdoc.close(false);



		}
		// }

		//交互提示


	}


}

function getFolder(str) {
	var index = str.lastIndexOf("/");
	if (index != -1)
		str = str.substring(0, index + 1);
	return str;
}
function getFile(str) {
	var index = str.lastIndexOf("/");
	if (index != -1)
		str = str.substring(index + 1);
	return str;
}

// 20180803
function getTimeStr() {
	var today = new Date();
	var y = checkTime(today.getFullYear());
	var m = checkTime(today.getMonth() + 1);
	var d = checkTime(today.getDate())
	return y + m + d;
}
function checkTime(i) {
	if (i < 10) i = "0" + i;
	return i.toString()
}
