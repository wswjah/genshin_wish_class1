const start = document.querySelector("#start");
const five = document.querySelector("#five");
const reset = document.querySelector("#reset");
const minm = document.querySelector("#minm");
const Close = document.querySelector("#close");
const audio = document.querySelector("audio");
const video = document.querySelector("video");
const result = document.querySelector("#result");
const resBg = document.querySelector("#resBg");
const image = document.querySelector("#image");
const selector = document.querySelector(".selector");
const rest = document.querySelector("#rest");
(() => {
	const Flag = document.createDocumentFragment();
	for (let i = 0; i < images.length; i++) {
		let img = document.createElement("img");
		img.src = `imgs/${images[i]}`;
		img.addEventListener("click", (e) => {
			e.preventDefault();
			change(i);
		});
		img.alt = " ";
		Flag.appendChild(img);
	}
	selector.appendChild(Flag);
})();
video.addEventListener("ended", () => {
	video.style.display = "none";
	ShowResult();
});
video.addEventListener("mousemove", (e) => {
	e.preventDefault();
});
video.addEventListener("click", (e) => {
	e.preventDefault();
});
video.addEventListener("mouseleave", (e) => {
	e.preventDefault();
});
video.addEventListener("mouseenter", (e) => {
	e.preventDefault();
});
video.addEventListener("mousewheel", (e) => {
	e.preventDefault();
});
video.addEventListener("mouseover", (e) => {
	e.preventDefault();
});
video.addEventListener("contextmenu", (e) => {
	e.preventDefault();
});
function ShowResult() {
	resBg.style.display = "block";
	let Width = window.innerWidth;
	let Height = window.innerHeight;
	resBg.style.width = Width + "px";
	resBg.style.height = Height + "px";
	result.classList.remove("gold");
	result.classList.remove("purple");
	result.style.display = "block";
	result.style.width = Width + "px";
	result.style.height = Height + "px";
	result.style.lineHeight = Height + "px";
	//result.classList.add("ani");
	resBg.removeEventListener("click", resBgClick);
	setTimeout(() => {
		//result.classList.remove("ani");
		resBg.addEventListener("click", resBgClick);
	}, 1200);
	let ind = -1;
	for (let i = 0; i < golds.length; i++) {
		if (golds[i] === last[0]) {
			ind = i;
			break;
		}
	}
	result.classList.add("DrawBackground");
	if (ind !== -1) {
		result.innerHTML = `<img src="imgs/${imgs[ind]}" alt="" style="display:none;"/>`;
		setTimeout(() => {
			let height = document.querySelector("#result img").height;
			let Height = window.innerHeight;
			let H = Height * 0.08 + height;
			result.innerHTML = `<img src="imgs/${imgs[ind]}" alt="" class="ani" />
									<div>
									<img src="imgs/star.png" class="star" style="top:${H}px"/>
									<img src="imgs/star.png" class="star" style="top:${H}px"/>
									<img src="imgs/star.png" class="star" style="top:${H}px"/>
									<img src="imgs/star.png" class="star" style="top:${H}px"/>
									<img src="imgs/star.png" class="star" style="top:${H}px"/>
									<span class="dot">
										<span class="dot-inner" style="background: rgb(255, 162, 31, 0.3);"></span>
									</span>
									</div>`;
		}, 50);
	} else {
		result.innerHTML = `<div>  
							<img src="imgs/star.png" class="star" />
							<img src="imgs/star.png" class="star" />
							<img src="imgs/star.png" class="star" />
							<img src="imgs/star.png" class="star" />
							<img src="imgs/NameBackground.png" class="nameBackground" style="transform: scale(0);"/>
                            <div class="XingHaiBackground ani">${
								names[last[0]]
							}</div>
							<span class="dot">
								<span class="dot-inner" style="background: rgba(128, 0, 128, 0.3);"></span>
							</span>
							</div>`;
		let nameBackground = document.querySelector(".nameBackground");
		setTimeout(() => {
			nameBackground.style.transform = "scale(1)";
		}, 700);
	}
	last.shift();
}
function resBgClick() {
	if (!canClick) {
		return;
	}
	if (last.length !== 0) {
		ShowResult();
	} else {
		resBg.style.display = "none";
		result.style.display = "none";
		isRunning = false;
	}
	canClick = false;
	setTimeout(() => {
		canClick = true;
	}, 600);
}
resBg.addEventListener("click", resBgClick);
function ani() {
	video.style.display = "block";
	let haveGold = false;
	last.forEach((i) => {
		if (golds.includes(i)) {
			haveGold = true;
		}
	});
	if (last.length === 5) {
		if (haveGold) {
			video.src = "videos/gold10.mp4";
		} else {
			video.src = "videos/purple10.mp4";
		}
	} else {
		if (haveGold) {
			video.src = "videos/gold1.mp4";
		} else {
			video.src = "videos/purple1.mp4";
		}
	}
	audio.src = "videos/audio.mp3";
	video.play();
	audio.play();
	let Width = window.innerWidth + 200;
	let Height = window.innerHeight + 400;
	video.style.width = Width + "px";
	video.style.height = Height + "px";
}
function run(n) {
	CloseRest();
	isRunning = true;
	if (n === 5 && needList[0]) {
		last = needList;
		needList = [];
	} else if (n === 1 && need !== -1) {
		last[0] = need;
		need = -1;
	} else {
		let x;
		let i = 0;
		for (i; i < n; i++) {
			x = Math.round(Math.random() * (contain.length - 1));
			while (last.includes(contain[x])) {
				x = Math.round(Math.random() * (contain.length - 1));
			}
			last[i] = contain[x];
		}
	}
	ani();
	contain = contain.filter((item) => {
		return !last.includes(item);
	});
	try {
		RecordHistory(last);
	} catch (e) {
		alert(`历史文件写入失败：${e}`);
	}
	return;
}
start.addEventListener("click", () => {
	if (isRunning) return;
	if (contain.length !== 0) {
		run(1);
	}
});
five.addEventListener("click", () => {
	if (isRunning) return;
	if (contain.length >= 5) {
		run(5);
	}
});
reset.addEventListener("click", () => {
	Init();
	alert("重置成功");
});

function Init() {
	contain = [];
	last = [];
	for (let i = 0; i < names.length; i++) {
		contain.push(i);
	}
}
Init();
function change(n) {
	image.src = `imgs/${images[n]}`;
	if (n === 0) now_up = 24;
	else now_up = 12;
}
let ShowRestClickNumber = 0;
function ShowRest() {
	if (ShowRestClickNumber === 1) {
		CloseRest();
		ShowRestClickNumber = 0;
		return;
	}
	ShowRestClickNumber++;
	let Width = window.innerWidth;
	rest.style.width = Width - 400 + "px";
	const frag = document.createDocumentFragment();
	for (let i = 0; i < contain.length; i++) {
		let span = document.createElement("span");
		span.innerHTML = names[contain[i]] + "      ";
		if (golds.includes(contain[i])) {
			span.classList.add("Gold");
		} else {
			span.classList.add("Purple");
		}
		frag.appendChild(span);
	}
	rest.appendChild(frag);
	rest.style.display = "block";
}
rest.addEventListener("click", (e) => {
	CloseRest();
});
function CloseRest() {
	if (rest.innerHTML === "") return;
	rest.innerHTML = "";
	rest.style.display = "none";
}
