function cercleCollision(obj1,obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= (obj1.radius + obj2.radius);
}

function cercleRectangle(x0,y0,w0,h0,cx,cy,r) {
    let testX = cx;
    let testY = cy;

    if (testX < x0) testX = x0;
    if(testX > (x0+w0)) testX = (x0+w0);
    if (testY < y0) testY = y0;
    if (testY > (y0 + h0)) testY = (y0 + h0);
    return ((cx - testX) * (cx - testX) +
            (cy - testY) * (cy - testY)) < r * r;
}

function cercleRectangleCentre(rx, ry, rw, rh, cx, cy, r) {
    const rrx = rx - rw / 2;
    const rry = ry - rh / 2;
    return cercleRectangle(rrx, rry, rw, rh, cx, cy, r);
}

export {cercleCollision, cercleRectangleCentre}