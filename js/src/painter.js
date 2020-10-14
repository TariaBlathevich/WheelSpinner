class Painter {

    paint(frame, cw, spinner) {
        cw.clear();
        let circle = this.getSpinnerCircle(cw.getBoundingRect());
        let wInfo = this.getWeightInfo(spinner.options);
        let polygon = circle.toPolygon(wInfo.totalWeight * wInfo.multiplier, spinner.rotation.dir);
        let slices = this.slicePolygon(circle, wInfo, polygon, spinner.options);
        slices.forEach(s => {
            cw.drawPolygon(s.body, s.color, '#111', 3);
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

    drawPointer(cw) {
        let rect = cw.getBoundingRect();
        let pointer = new Gmt.Polygon();
        pointer.add(rect.width/2 - 20, 2);
        pointer.add(rect.width/2 + 20, 2);
        pointer.add(rect.width/2, 30);
        cw.drawPolygon(pointer, '#444', '#222', 3);
    }

}