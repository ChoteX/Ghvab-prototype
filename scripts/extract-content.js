const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const ROOT = path.resolve(__dirname, "..");

const geAnswerKey = {
    q1: { correct: "c", explanation: "რიცხვი რომ იყოს 6-ის ჯერადი, უნდა იყოფოდეს 2-ზეც და 3-ზეც; მხოლოდ 1002 აკმაყოფილებს ორივე პირობას.", scored: true },
    q2: { correct: "a", explanation: "400/(25-75) = -8 და 200/(13-33) = -10, შესაბამისად -8 - (-10) = 2.", scored: true },
    q3: { correct: null, explanation: "ამოცანის პირობის ნაწილები აკლია სკანში, ამიტომ პასუხი არ ფასდება.", scored: false },
    q4: { correct: null, explanation: "შედარების კრიტერიუმი ფრაგმენტში არ ჩანს, სრული ტექსტი საჭიროა.", scored: false },
    q5: { correct: null, explanation: "მონაკვეთების აღწერა არასრულია, ამოცანა არ იფასება.", scored: false },
    q6: { correct: null, explanation: "კლასების შესახებ მონაცემები დაზიანებულია, შედეგის დადგენა შეუძლებელია.", scored: false },
    q7: { correct: "b", explanation: "15-ის ჯერადი უნდა იყოფოდეს 3-ზეც და 5-ზეც. 4005 მთავრდება ციფრით 5 და ციფრთა ჯამი 9-ს ტოლია, რომელიც იყოფა 3-ზე.", scored: true },
    q8: { correct: null, explanation: "მოცემული დიაპაზონები 101-ს სწორად არ აკრავს, მიმართეთ სრულ გამოცემას.", scored: false },
    q9: { correct: null, explanation: "ფაქტორიზაციის ვარიანტები დაზიანებულია, ავტომატური შეფასება ვერ ხერხდება.", scored: false },
    q10: { correct: "a", explanation: "ყველა დადებითი რიცხვი იყოფა 1-ზე, ამიტომ 1 არის 36-ის უმცირესი დადებითი გამყოფი.", scored: true },
    q11: { correct: null, explanation: "ალგებრული ფორმულირება ფრაგმენტულადაა მოტანილი, გამოყენეთ სრული ტექსტი.", scored: false },
    q12: { correct: null, explanation: "k და N-ის შესახებ მონაცემები დაზუსტებას საჭიროებს, პასუხი არ იფასება.", scored: false },
    q13: { correct: "c", explanation: "3-ის ხარისხების ერთეულების ციფრი ყოველ ოთხ ნაბიჯში მეორდება (3, 9, 7, 1). \\(123^5\\)-ს აქვს იგივე ერთეული, რაც \\(3^5\\)-ს — 3.", scored: true },
    q14: { correct: null, explanation: "7-ზე გაყოფადობის წესისთვის აუცილებელი ციფრები დაუსრულებელია, შეფასება შეუძლებელია.", scored: false }
};

const enAnswerKey = {
    q1: { correct: "c", explanation: "A multiple of 6 must be divisible by both 2 and 3; only 1002 meets both conditions.", scored: true },
    q2: { correct: "a", explanation: "400/(25-75) = -8 and 200/(13-33) = -10, so -8 - (-10) = 2.", scored: true },
    q3: { correct: null, explanation: "The source excerpt omits crucial data, so this item is left unscored.", scored: false },
    q4: { correct: null, explanation: "The ordering criterion is missing from the fragment; consult the full text.", scored: false },
    q5: { correct: null, explanation: "Interval descriptions are incomplete, so the question is not graded.", scored: false },
    q6: { correct: null, explanation: "Essential class-size details are missing, preventing automatic grading.", scored: false },
    q7: { correct: "b", explanation: "A multiple of 15 must be divisible by 3 and 5. 4005 ends with 5 and its digit sum 9 is divisible by 3.", scored: true },
    q8: { correct: null, explanation: "The given ranges do not bracket 101; refer to the full text.", scored: false },
    q9: { correct: null, explanation: "Factorisation options are truncated, so grading is impossible.", scored: false },
    q10: { correct: "a", explanation: "Every positive integer is divisible by 1, making 1 the smallest positive divisor of 36.", scored: true },
    q11: { correct: null, explanation: "Key algebraic details are missing; review the full problem statement.", scored: false },
    q12: { correct: null, explanation: "Information about k and N is absent, so the answer is undefined here.", scored: false },
    q13: { correct: "c", explanation: "The units digit of powers of 3 cycles every four steps (3, 9, 7, 1). \\(123^5\\) shares the 3.", scored: true },
    q14: { correct: null, explanation: "Digits needed for the divisibility-by-7 check are missing, so no automatic grading.", scored: false }
};

function readHtml(file) {
    return fs.readFileSync(path.join(ROOT, file), "utf8");
}

function normalizeText(text) {
    if (!text) {
        return "";
    }
    const collapsed = text.replace(/\s+/g, " ");
    return collapsed;
}

function nodeToJson(node) {
    if (!node) {
        return null;
    }

    if (node.type === "text") {
        const text = normalizeText(node.data || "");
        if (text.trim().length === 0) {
            return null;
        }
        return { type: "text", text };
    }

    if (node.type !== "tag") {
        return null;
    }

    const element = {
        type: "element",
        tag: node.name
    };

    const attribs = node.attribs || {};
    const classes = (attribs.class || "")
        .split(/\s+/)
        .map((value) => value.trim())
        .filter(Boolean);

    if (classes.length > 0) {
        element.classes = classes;
    }

    const attributes = Object.keys(attribs)
        .filter((name) => name !== "class")
        .sort()
        .reduce((acc, name) => {
            acc[name] = attribs[name];
            return acc;
        }, {});

    if (Object.keys(attributes).length > 0) {
        element.attributes = attributes;
    }

    const children = [];
    (node.children || []).forEach((child) => {
        const jsonChild = nodeToJson(child);
        if (jsonChild) {
            children.push(jsonChild);
        }
    });

    if (children.length > 0) {
        element.children = children;
    }

    return element;
}

function extractTemplateContent(html, selector) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const template = $(selector).first();
    if (template.length === 0) {
        return [];
    }
    const innerHtml = template.html() || "";
    if (!innerHtml.trim()) {
        return [];
    }
    const inner$ = cheerio.load(innerHtml, { decodeEntities: false });
    const nodes = [];
    const scope = inner$("body").length > 0 ? inner$("body").contents() : inner$.root().contents();
    scope.each((_, child) => {
        const json = nodeToJson(child);
        if (json) {
            nodes.push(json);
        }
    });
    return nodes;
}

function extractMainContent(html, selector) {
    const $ = cheerio.load(html, { decodeEntities: false });
    const main = $(selector).first();
    if (main.length === 0) {
        return [];
    }
    const nodes = [];
    main.children().each((_, child) => {
        const json = nodeToJson(child);
        if (json) {
            nodes.push(json);
        }
    });
    return nodes;
}

function writeJson(file, data) {
    const target = path.join(ROOT, file);
    fs.writeFileSync(target, JSON.stringify(data, null, 2), "utf8");
}

function extractGeorgian() {
    const html = readHtml("part1.html");
    const $ = cheerio.load(html, { decodeEntities: false });
    const meta = {
        pageTitle: $("title").first().text(),
        documentLang: $("html").attr("lang") || "ka",
        headerTitle: $(".header-title").first().text().trim(),
        toggleLabelInactive: $("#language-toggle").first().text().trim(),
        toggleLabelActive: "ქართული ვერსია",
        sidebarTitle: $(".sidebar h2").first().text().trim(),
        sidebarAriaLabel: $(".sidebar nav").first().attr("aria-label") || ""
    };
    const content = extractTemplateContent(html, "#content-ka");
    return { meta, mainContent: content, answerKey: geAnswerKey };
}

function extractEnglish() {
    const html = readHtml("part1_english.html");
    const $ = cheerio.load(html, { decodeEntities: false });
    const meta = {
        pageTitle: $("title").first().text(),
        documentLang: $("html").attr("lang") || "en",
        headerTitle: "Chapter I",
        toggleLabelInactive: "ქართული ვერსია",
        toggleLabelActive: "English Version",
        sidebarTitle: "Contents",
        sidebarAriaLabel: "Table of Contents"
    };
    const content = extractMainContent(html, ".main-content");
    return { meta, mainContent: content, answerKey: enAnswerKey };
}

function main() {
    const ge = extractGeorgian();
    const en = extractEnglish();
    writeJson("content-ka.json", ge);
    writeJson("content-en.json", en);
    // eslint-disable-next-line no-console
    console.log("Content extracted to content-ka.json and content-en.json");
}

main();
