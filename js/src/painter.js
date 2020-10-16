class Painter {

    paint(frame, cw, spinner) {
        cw.clear();
        let circle = this.getSpinnerCircle(cw.getBoundingRect());
        let wInfo = this.getWeightInfo(spinner.options);
        let polygon = circle.toPolygon(wInfo.totalWeight * wInfo.multiplier, spinner.rotation.dir);
        let slices = this.slicePolygon(circle, wInfo, polygon, spinner.options);
        let painter = this;
        slices.forEach(s => {
            cw.drawPolygon(s.body, s.color, '#333', 3);
            painter.writeOptionText(cw, s);
        })
        this.drawPointer(cw);
    }

    getSpinnerCircle(rect) {
        return new Gmt.Circle(
            rect.width/2,
            rect.height/2,
            Math.min(rect.width, rect.height)/2 - 10
        );
    }

    getWeightInfo(options) {
        let totalWeight = 0;
        options.forEach(e => {
            totalWeight += parseInt(e.weight || 1);
        });
        return {
            totalWeight: totalWeight,
            multiplier: Math.ceil(50/totalWeight)
        }
    }

    slicePolygon(circle, wInfo, polygon, options) {
        let slices = [];
        let center = circle.getCenter();
        let oIter = 0;
        let wIter = 0;
        let currentSlice = null;
        let vertices = polygon.toVertices();
        for(let i = 0; i <= vertices.length; i++) {
            let v = i === vertices.length ? vertices[0] : vertices[i];
            let o = options[oIter];
            if(!currentSlice) {
                if(!o) {
                    continue;
                }
                currentSlice = {
                    body: new Gmt.Polygon(center.x, center.y),
                    color: o.color,
                    name: o.name
                };
            }
            currentSlice.body.push(v);
            wIter++;
            if(wIter - 1 >= o.weight * wInfo.multiplier) {
                i--;
                slices.push(currentSlice);
                currentSlice = null;
                oIter++;
                wIter = 0;
            }
        }
        return slices;
    }

    writeOptionText(cw, slice) {
        let ver1 = slice.body.toVertices()[0];
        let ver2 = slice.body.toVertices()[1];
        let dir = this._dirToVertex(ver1, ver2);
        let targetVer = ver2.copy();
        targetVer.movePolar(10, dir - Math.PI * 0.3)
        cw.write(slice.name, targetVer.x + 1, targetVer.y + 1, 'white', 30, 'Arial', dir, 0.7);
        cw.write(slice.name, targetVer.x, targetVer.y, 'black', 30, 'Arial', dir, 0.7);
    }

    _dirToVertex(vFrom, vTo) {
        return Gmt.cartesianToPolar(vFrom.x - vTo.x, vFrom.y - vTo.y).phi;
    }

    drawPointer(cw) {
        let rect = cw.getBoundingRect();
        let pointer = new Gmt.Polygon();
        pointer.add(rect.width/2 - 20, 2);
        pointer.add(rect.width/2 + 20, 2);
        pointer.add(rect.width/2, 30);
        cw.drawPolygon(pointer, '#666', '#333', 3);
    }

}