console.clear();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
document.body.style.margin = '0';
document.body.style.overflow = 'hidden';
const [w, h] = [innerWidth, innerHeight];
[canvas.width, canvas.height] = [w, h];

let tree, lines;
let time = 0;

canvas.addEventListener('click', reset);

reset();
requestAnimationFrame(loop);

function reset(){
	tree = {root: {pos: [w / 2, h / 2], childs: []}};
	lines = [];
}

function loop(){
	ctx.fillStyle = '#000000';
	ctx.fillRect(0, 0, w, h);
	
	expandTree();
	drawTreeNode(tree.root, time * 120);
	
	time += 1 / 60;
	
	requestAnimationFrame(loop);
}

function expandTree(){
	if(lines.length > 25) return;
	
	let node = tree.root;
	while(true){
		if(!node.childs.length){
			grow(node);
			return;
		}
		if(Math.random() < 1 - node.childs.length * 0.3 && grow(node)) return;
		node = node.childs[node.childs.length * Math.random() |0];
	}
}

function grow(node){
	const r = 32 + Math.random() * 128;
	const angle = Math.PI * 2 * Math.random()
	const newNode = {
		pos: [
				node.pos[0] + Math.cos(angle) * r,
				node.pos[1] + Math.sin(angle) * r,
		],
		childs: [],
	};
	if(
		node.pos[0] < 0
		|| node.pos[0] > w
		|| node.pos[1] < 0
		|| node.pos[1] > h
	) return false;
	
	for(const line of lines){
		if(line.parent === node) continue;
		if(line.next === node) continue;
		const intersection =
					getSegSegIntersection(line.a, line.b, node.pos, newNode.pos);
		if(intersection) {
			// ctx.beginPath();
			// ctx.arc(intersection[0], intersection[1], 5, 0, Math.PI * 2);
			// ctx.fillStyle = '#ff0000';
			// ctx.fill();
			return false;
		}
	}
	
	lines.push({a: node.pos, b: newNode.pos, parent: node, next: newNode});
	node.childs.push(newNode);
	return true;
}

function drawTreeNode(node, colorAngle){
	ctx.beginPath();
	ctx.arc(node.pos[0], node.pos[1], 1, 0, Math.PI * 2);
	ctx.fillStyle = '#ffff00';
	ctx.fill();
	
	for(const childNode of node.childs){
		ctx.beginPath();
		ctx.moveTo(node.pos[0], node.pos[1]);
		ctx.lineTo(childNode.pos[0], childNode.pos[1]);
		ctx.strokeStyle = `hsl(${colorAngle}, 50%, 50%)`;
		ctx.stroke();
		drawTreeNode(childNode, colorAngle + 30);
	}
}

function getSegSegIntersection(a, b, c, d) {
  let bax = b[0] - a[0];
  let bay = b[1] - a[1];
  let dcx = d[0] - c[0];
  let dcy = d[1] - c[1];
  let acy = a[1] - c[1];
  let acx = a[0] - c[0];
  if (bay / bax === dcy / dcx) return null;

  let l = bax * dcy - bay * dcx;
  if (l === 0) return null;

  let r = (acy * dcx - acx * dcy) / l;
  let s = (acy * bax - acx * bay) / l;

  if (r >= 0 && r <= 1 && s >= 0 && s <= 1) {
    return [
      a[0] + r * bax,
      a[1] + r * bay,
    ];
  }
  return null;
} //