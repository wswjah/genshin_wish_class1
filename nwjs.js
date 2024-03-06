const win = nw.Window.get();
let back = null;
minm.addEventListener("click", (e) => {
	e.preventDefault();
	win.minimize();
	nw.Window.open(
		"back.html",
		{
			position: "center",
			width: 100,
			height: 100,
			frame: false,
			new_instance: true,
			mixed_context: true,
			transparent: true,
			always_on_top: true,
			show_in_taskbar: false,
		},
		(window) => {
			back = window;
			window.x = 0;
			window.y = 700;
			window.isTransparent = true;
			window.on("closed", () => {
				win.restore();
				back = null;
			});
		}
	);
});
const History = document.getElementById("History");
let history = null;
History.addEventListener("click", (e) => {
	e.preventDefault();
	if (history != null) {
		return;
	}
	nw.Window.open(
		"history.html",
		{
			position: "center",
			width: 1600,
			height: 720,
			frame: false,
			new_instance: true,
			mixed_context: true,
			transparent: true,
			always_on_top: true,
			show_in_taskbar: false,
			resizable: false, // 禁止调整窗口大小
		},
		(window) => {
			history = window;
			window.isTransparent = true;
			window.on("closed", () => {
				history = null;
			});
		}
	);
});
Close.addEventListener("click", (e) => {
	e.preventDefault();
	tray.remove();
	nw.App.unregisterGlobalHotKey(AltShiftF5);
	nw.App.unregisterGlobalHotKey(AltShiftF6);
	if (back != null) {
		back.close();
		back = null;
	}
	if (history != null) {
		history.close();
		history = null;
	}
	win.close();
});
const AltShiftF5 = new nw.Shortcut({
	key: "Alt+Shift+F5",
	active: (e) => {
		need = parseInt(prompt("Input a Number:"));
		if (contain.includes(need) || need === 55 || need === 56) {
			alert("Active!");
		} else {
			alert(`Failed!`);
			need = 0;
		}
	},
	failed: (e) => {
		alert(e);
	},
});
const AltShiftF6 = new nw.Shortcut({
	key: "Alt+Shift+F6",
	active: (e) => {
		let x = prompt(
			"Input a Array which length is five and separated by commas:"
		);
		let flag = true;
		needList = x.split(",").map((item) => {
			if (
				!contain.includes(parseInt(item)) &&
				parseInt(item) !== 55 &&
				parseInt(item) !== 56
			) {
				flag = false;
				return 0;
			}
			return parseInt(item);
		});
		if (needList.length !== 5 || !flag) {
			alert("Failed!");
			needList = [];
		} else {
			alert("Active!");
		}
	},
	failed: (e) => {
		alert(e);
	},
});
nw.App.registerGlobalHotKey(AltShiftF5);
nw.App.registerGlobalHotKey(AltShiftF6);
const menu = new nw.Menu();
menu.append(
	new nw.MenuItem({
		label: "Return",
		click: () => {
			if (back != null) {
				back.close();
				back = null;
			}
			win.restore();
		},
		icon: "imgs/return.png",
		clicked: true,
	})
);
menu.append(
	new nw.MenuItem({
		label: "Close",
		click: () => {
			if (back != null) {
				back.close();
				back = null;
			}
			if (history != null) {
				history.close();
				history = null;
			}
			tray.remove();
			nw.App.unregisterGlobalHotKey(AltShiftF5);
			nw.App.unregisterGlobalHotKey(AltShiftF6);
			win.close();
		},
		icon: "imgs/close.png",
		clicked: true,
	})
);
const tray = new nw.Tray({
	title: "Genshin",
	icon: "imgs/tray.png",
	toolbar: "Genshin Wish",
	menu: menu,
});
tray.on("click", (e) => {
	if (back != null) {
		back.close();
		back = null;
	}
	win.restore();
});

const fs = require("fs");
const path = require("path");
const os = require("os");
const HistoryPath = path.join(os.homedir(), "/AppData/Local/GenshinWish");
if (!fs.existsSync(HistoryPath)) {
	fs.mkdirSync(HistoryPath);
}
function RecordHistory(data) {
	const WriteStream = fs.createWriteStream(`${HistoryPath}/history.txt`, {
		flags: "a",
		encoding: "utf-8",
		start: 0,
	});
	let inform = new Date().toLocaleString("zh-CN", { hour12: false });
	inform += "-";
	if (data.length === 1) {
		inform += data[0].toString();
		inform += ",";
		inform = inform.padEnd(32, "0");
	} else {
		for (let i = 0; i < data.length; i++) {
			inform += data[i].toString().padStart(2, "0");
			if (i !== data.length - 1) {
				inform += ",";
			}
		}
	}
	inform += "\n";
	WriteStream.on("end", () => {
		alert("文件写入完成");
		WriteStream.close();
	});
	WriteStream.write(inform, "utf-8");
	WriteStream.end();
}
