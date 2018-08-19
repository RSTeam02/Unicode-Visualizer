

/**
 * @author sakaijun
 * Select a (pre)defined unicode block (as hex number)
 * create a raster of unicode characters
 * if mouse points an icon and it's clicked, display the content in full size, responsive and dependent on browser window size
 * 
 */

export class Controller {

    constructor() {
        $("fieldset").before("<div id ='container'></div>");
        $("#container").append('<div id ="cssContent"></div>');
        this.resize();
        this.resizeListener();
        this.utfBlockListener();
        this.rangeListener();
        this.initRaster();
        this.keyListener();
    }

    keyListener() {
        $("#utfFromTo").on("keydown", (e) => {
            if (e.keyCode === 13) {
                this.initRaster();
            }
        });
    }

    initRaster() {
        let block = this.utfSelect();
        $("#cssContent").attr("content", String.fromCodePoint(block.from + Math.floor(Math.random() * block.len)));
        this.loadRaster(block);
        this.utfRasterListener();
    }

    utfBlockListener() {
        $(".utfBlk").on("click", () => {
            let block = this.utfSelect();
            $("#uc").attr("min", block.from);
            $("#uc").attr("max", block.to);
            $("#uc").attr("value", block.from);
            this.loadRaster(block);
            this.utfRasterListener();
        });
    }

    utfRasterListener() {
        $(".icon").on("click", (e) => {
            $("#cssContent").attr("content", String.fromCodePoint(parseInt($(e.target).attr("value"))));
        });
       
    }

    resizeListener() {
        $(window).resize(() => {
            this.resize();
        });
    }

    rangeListener() {
        $(".option").on("input", (e) => {
            let font;
            let ucode = $("#uc").val();
            font = ($("#sans").prop('checked')) ? "serif" : "sans-serif";
            $("#cssContent").css("font-family", font);            
            $("#cssContent").attr("content", String.fromCodePoint(ucode));
        });
    }

    resize() {
        var height = $(window).height();
        var width = $(window).width();
        var size = 0;
        size = (height > width) ? window.innerWidth : window.innerHeight
        $("#cssContent").css("font-size", size);
    }

    utfSelect() {
        let emojiBlock = {
            from: 0x1F600,
            to: 0x1F64F,
            len: Number(0x1F64F) - Number(0x1F600)
        }
        let pictoBlock = {
            from: 0x1F300,
            to: 0x1F5FF,
            len: Number(0x1F5FF) - Number(0x1F300)
        }
        let userRange = $("#utfFromTo").val().split("-");
        let utfRange = {
            from: Number(`0x${userRange[0]}`),
            to: Number(`0x${userRange[1]}`),
            len: Number(`0x${userRange[1]}`) - Number(`0x${userRange[0]}`)
        }
        let selection = $("input:radio[class='utfBlk']:checked").attr("id");
        let utfBlock = {};
        if (selection == "smilies") {
            utfBlock = emojiBlock;
        } else if (selection == "pictograms") {
            utfBlock = pictoBlock;
        } else {
            try {
                if (isNaN(parseInt(utfRange.from, 16)) || isNaN(parseInt(utfRange.to, 16))) {
                    throw "Not a valid unicode hex-range";
                } else {
                    utfBlock = utfRange;
                }
            } catch (error) {
                console.log(error)
            }
        }

        return utfBlock;
    }

    loadRaster(block) {
        $("#utfRaster").remove();
        $("<div id='utfRaster'></div>").insertAfter("#container");
        for (let i = block.from; i <= block.to; i++) {
            $("#utfRaster").append(`<span class="icon" title="${i.toString(16).toUpperCase()}" value=${i}>${String.fromCodePoint(i)}</span>`);
        }
    }
}