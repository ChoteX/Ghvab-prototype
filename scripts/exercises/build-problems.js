const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const OUTPUT_DIR = path.join(ROOT, "exercises");

function writeJson(filename, data) {
    const target = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(target, JSON.stringify(data, null, 2), "utf8");
}

function makePar1Data() {
    const exerciseItemsData = [
        {
            number: "1.1.",
            lines: [
                "რომელი შემდეგი რიცხვებიდან არის მარტივი?",
                "(1) 55 (2) 617 (3) 5027 (4) 42028"
            ]
        },
        {
            number: "1.2.",
            lines: [
                "რომელი შემდეგი რიცხვებიდან არის შედგენილი?",
                "(1) 389 (2) 1507 (3) 323061 (4) 52713"
            ]
        },
        {
            number: "1.3.",
            lines: [
                "განსაზღვრეთ შემდეგი რიცხვების ლუწობა (ლუწი/კენტი):",
                "(1) 531 (2) 2399 (3) 4057 (4) 20712"
            ]
        },
        {
            number: "1.4.",
            lines: [
                "აირჩიეთ სწორი დებულებები მთელ რიცხვებზე:",
                "(1) და (2) <em>[დებულების ვარიანტები წყაროში]</em>",
                "(3) <em>შესაძლებელია ჩამოვაყალიბოთ …</em> (4) <em>ნული არც დადებითია და არც უარყოფითი.</em>"
            ]
        },
        {
            number: "1.5.",
            lines: [
                "განსაზღვრეთ თითოეული შედეგის ნიშანი (დადებითი/უარყოფითი/ნული) ზუსტი მნიშვნელობის გამოთვლის <em>გარეშე</em>.",
                "(კონტექსტი: ჯამები/ნამრავლები მითითებული ნიშნებით.)"
            ]
        },
        {
            number: "1.6.",
            lines: [
                "რომელი შემდეგთაგანია მთელი რიცხვები?",
                "(1) $a+b$ (2) $a-b$ (3) $c+d$ (4) $\\tfrac{c}{d}$ (5) $cd$ (6) $a+c$ (7) $a-c$ (8) $ac$ (9) $2c+a$ (10) $2c-3a$ (11) $a^2-c^2$ (12) $3a^2+2c^2$"
            ]
        },
        {
            number: "1.7.",
            lines: [
                "გამოთვალეთ (ოპერაციების თანმიმდევრობა და ფრჩხილები):",
                "(1) $24$ (2) $77$ (3) $128$ (4) $4128$ <em>[მოკლე პრაქტიკის ამოცანები]</em>"
            ]
        },
        {
            number: "1.8.",
            lines: [
                "იპოვეთ შემდეგი წყვილების (ან სიმრავლეების) უმცირესი საერთო ჯერადი (უსჯ).",
                "(1) 28 (2) 99 (3) 200 (4) 532"
            ]
        },
        {
            number: "1.9.",
            lines: [
                "იპოვეთ შემდეგი მთელი რიცხვების უდიდესი საერთო გამყოფი (უსგ).",
                "(1) 12 (2) 13 (3) 50 (4) 120"
            ]
        },
        {
            number: "1.10.",
            lines: ["რამდენი ნატურალური გამყოფი აქვს $66$-ს?"]
        },
        {
            number: "1.11.",
            lines: [
                "იპოვეთ მოცემული რიცხვების საერთო გამყოფების რაოდენობა.",
                "(1) 15 (2) 19 (3) 27 (4) 48"
            ]
        },
        {
            number: "1.12.",
            lines: [
                "გამოთვალეთ თითოეული წყვილის უსჯ:",
                "(1) $12$ და $42$ (2) $240$ და $360$ (3) $1680$ და $4200$ (4) $180,\\ 270,\\ 450$"
            ]
        },
        {
            number: "1.13.",
            lines: [
                "გამოთვალეთ თითოეული ჯგუფის უსგ:",
                "(1) $12$ და $15$ (2) $24,\\ 30,\\ 60$ (3) $7,\\ 8,\\ 13$ (4) $20,\\ 65,\\ 125$"
            ]
        },
        {
            number: "1.14.",
            lines: [
                "გაამარტივეთ შემდეგი გამოსახულებები:",
                "(1) $2^5\\cdot 3^7\\cdot 5^{-3}$ და $2^1\\cdot 3^3\\cdot 5^2$",
                "(2) $2^{-7}\\cdot 3^2$ და $2^2\\cdot 7^3$ <em>[სტანდარტიზებული ხარისხები წყაროს მიხედვით]</em>"
            ]
        },
        {
            number: "1.15.",
            lines: [
                "სიტყვიერი ამოცანები გაყოფადობაზე (პარაფრაზირებული სკანირებიდან):",
                "(1) თუ რიცხვი ტოვებს ნაშთს $n$ გაყოფისას $m$-ზე, რა არის … ნაშთი?",
                "(2) თუ მთელი რიცხვი იზრდება $+2$-ით, როგორ იცვლება ლუწობა?",
                "(3) <em>[გაყოფადობა ჯამებით]</em> (4) თუ მთელი რიცხვი იზრდება $+1$-ით, როგორ …?"
            ]
        },
        {
            number: "1.16.",
            lines: [
                "ააგეთ უმცირესი (ან უდიდესი) $n$-ნიშნა რიცხვი, რომელიც აკმაყოფილებს მოცემულ ციფრულ შეზღუდვებს. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.17.",
            lines: [
                "რამდენი მთელი რიცხვი აკმაყოფილებს მოცემულ უტოლობას/ინტერვალს? <em>[მთელი ამონახსნების რაოდენობა]</em>"
            ]
        },
        {
            number: "1.18.",
            lines: [
                "კლასის ამოცანა დაჯდომა/განლაგების შესახებ ჯამებით 30, 40 და 47. განსაზღვრეთ რამდენი … <em>[სრულ კონტექსტში]</em>"
            ]
        },
        {
            number: "1.19.",
            lines: [
                "მიაწყვეთ ორი სია ლუწი და კენტი რიცხვებით, დაათვლეთ. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.20.",
            lines: ["რომელი რიცხვებია 5-ის ჯერადი და მოახდინეთ დასაბუთება."]
        },
        {
            number: "1.21.",
            lines: [
                "დაადგინეთ ხაზგასმული ციფრის რანგი თითოეულ ჩანაწერში:",
                "(1) $\\underline{5}4312$ (2) $4532\\underline{\\phantom{0}}$ (3) $32*25$ (4) $*3260$ (5) $423*0$ (6) $*2310$ <em>[სიმბოლო * ნიშნავს ციფრთა მიმდევრობას]</em>"
            ]
        },
        {
            number: "1.22.",
            lines: [
                "ჩაწერეთ შემდეგი დიდი რიცხვები ათასეულების გამოყოფით და სიტყვიერად:",
                "(1) 1275 (2) 33333 (3) 10203040 (4) 1919191919"
            ]
        },
        {
            number: "1.23.",
            lines: [
                "ორი სიტყვიერი ამოცანა „5 დღით“ და „7 დღით“ — გამოიყენეთ უსჯ/უსგ. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.24.",
            lines: [
                "თუ $a$ და $b$ მთელი რიცხვებია და $a-b$ იყოფა 5-ზე, რომელ გამოსახულებებს ექნებათ 5-ის ჯერადობა? <em>[წყაროს მიხედვით]</em>"
            ]
        },
        {
            number: "1.25.",
            lines: [
                "თუ მთელი რიცხვი 17-ზე იყოფა და დაკავშირებული გამოსახულება 8-ს უდრის, რა შეგვიძლია ვთქვათ $a+b$-ზე 17-ის მოდულით? <em>[წყაროს მიხედვით]</em>"
            ]
        },
        {
            number: "1.26.",
            lines: [
                "მოკლე პასუხები:",
                "(1) <em>აირჩიეთ სწორი ვარიანტი ნიშნისა და ზომის მიხედვით.</em>",
                "(2) დაახლოეთ რიცხვი ჯერ უახლოეს 10-მდე, შემდეგ უახლოეს 100-მდე. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.27.",
            lines: [
                "მოათავსეთ მოცემული ინტერვალები რიცხვთა წრფეზე:",
                "(1) −2-დან 0-მდე (2) −2-დან 3-მდე (3) −5-დან 1-მდე (4) −1-დან 9-მდე"
            ]
        },
        {
            number: "1.28.",
            lines: [
                "გამოთვალეთ:",
                "(1) −2+5−6 (2) −11−(−3) (3) 14−(−4) (4) −17+(+2) (5) (−2−3)+2+5 (6) (−2+6)+(−6) (7) (−2−5)−(+3−7) (8) (−10+3−4)(4−6)"
            ]
        },
        {
            number: "1.29.",
            lines: [
                "გამოთვალეთ:",
                "(1) $3(9-11)-4(8-9)$ (2) $-5(-7-5)+3(6-9)$ (3) $\\dfrac{5\\,(9-13)\\,(-4)}{-8\\,(9-14)}$ (4) $\\dfrac{-7\\,(20-11)\\cdot 2}{3\\,(2-16)}$"
            ]
        },
        {
            number: "1.30.",
            lines: [
                "გამოთვალეთ:",
                "(1) $36:3-9$ (2) $36:(3-9)$ (3) $30-15:3$ (4) $(30-15):3$ (5) $240-25:(13-8)$ (6) $120:(10-16)-20$ (7) $50-(-20):5$ (8) $(50-(-20)):5$"
            ]
        },
        {
            number: "1.31.",
            lines: [
                "სიტყვიერი ამოცანები:",
                "(1) მუშაკი ერთ საქმეს 6 დღეში ასრულებს და მეორე დავალებაზე 70 გვერდს ამუშავებს; თუ 50 გვერდი უკვე შესრულებულია, რამდენი დღეა საჭირო დარჩენილი ნაწილისთვის?",
                "(2) რიცხვი $152\\;2\\underline{\\phantom{0}}3$ იყოფა 16-ზე; იპოვეთ დაკარგული ციფრი. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.32.",
            lines: [
                "კლასში A არის 10-ით მეტი მოსწავლე, ვიდრე კლასში B. თუ … როდესაც კლასები გაერთიანდება … იპოვეთ A-ის და B-ის ზომები. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.33.",
            lines: [
                "მართკუთხედი პერიმეტრის ინფორმაციით; იპოვეთ გვერდების სიგრძეები მოცემული კავშირებით და იმით, რომ პერიმეტრი არის 28. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.34.",
            lines: [
                "მატარებელი გადის 59 კმ პირველ საათში და … განსაზღვრეთ საერთო მანძილი 10 საათის შემდეგ. <em>[როგორც წყაროში]</em>"
            ]
        },
        {
            number: "1.35.",
            lines: [
                "დავუშვათ $x,y,z$ არის მთელი რიცხვები. თუ $xy-3z$ იყოფა … განსაზღვრეთ არის თუ არა …"
            ]
        },
        {
            number: "1.36.",
            lines: [
                "აირჩიეთ სწორი სამეცნიერო ნოტაცია (ან სიდიდე) თითოეული რიცხვისთვის:",
                "(1) $10$ (2) $10 000$ (3) $41$"
            ]
        },
        {
            number: "1.37.",
            lines: [
                "გამოთვალეთ კვადრატები (შაბლონის ამოცნობა):",
                "(1) $(11)^2$ (2) $(111)^2$ (3) $(1000)^2$ (4) $(10000)^2$"
            ]
        }
    ];

    const quizQuestions = [
        {
            id: "q1",
            number: "1.",
            prompt: "რომელი შემდეგი რიცხვებიდან იყოფა $6$-ზე?",
            options: [
                { value: "a", label: "273" },
                { value: "b", label: "412" },
                { value: "c", label: "1002" },
                { value: "d", label: "3004" }
            ]
        },
        {
            id: "q2",
            number: "2.",
            prompt: "გამოთვალეთ: $400:(25-75)-200:(13-33)$",
            options: [
                { value: "a", label: "$2$" },
                { value: "b", label: "$18$" },
                { value: "c", label: "$-18$" },
                { value: "d", label: "$-2$" }
            ]
        },
        {
            id: "q3",
            number: "3.",
            prompt: "რომელ წელს 2011-სა და … შორის ხდება … რაოდენობა გაყოფადი $5$-ზე?",
            options: [
                { value: "a", label: "2" },
                { value: "b", label: "5" },
                { value: "c", label: "3" }
            ]
        },
        {
            id: "q4",
            number: "4.",
            prompt: "დავუშვათ $a,b,c,d$ განისაზღვრება $a=3\\cdot(5-7)$, $b=3-5-7$, $c=ab$, $d=a+b$. აირჩიეთ სწორი თანმიმდევრობა:",
            options: [
                { value: "a", label: "$a,c,b,d$" },
                { value: "b", label: "$c,a,d,b$" },
                { value: "c", label: "$c,d,b,a$" },
                { value: "d", label: "$c,d,a,b$" }
            ]
        },
        {
            id: "q5",
            number: "5.",
            prompt: "რიცხვი $123$ იზრდება 8-ით და შემდეგ მცირდება 3-ით. რომელ ინტერვალში მოექცევა შედეგი?",
            options: [
                { value: "a", label: "10" },
                { value: "b", label: "15" },
                { value: "c", label: "20" },
                { value: "d", label: "12" }
            ]
        },
        {
            id: "q6",
            number: "6.",
            prompt: "სკოლაში არის 155 პირველკლასელი და 62 … რომელია უახლოესი მარტივი რიცხვი?",
            options: [
                { value: "a", label: "20" },
                { value: "b", label: "25" },
                { value: "c", label: "27" },
                { value: "d", label: "31" }
            ]
        },
        {
            id: "q7",
            number: "7.",
            prompt: "რომელი რიცხვია $15$-ის ჯერადი?",
            options: [
                { value: "a", label: "5005" },
                { value: "b", label: "4005" },
                { value: "c", label: "1015" },
                { value: "d", label: "2015" }
            ]
        },
        {
            id: "q8",
            number: "8.",
            prompt: "იპოვეთ $101$-ის უახლოესი მარტივი რიცხვი მარჯვნიდან და მარცხნიდან.",
            options: [
                { value: "a", label: "909" },
                { value: "b", label: "816" },
                { value: "c", label: "807" },
                { value: "d", label: "809" }
            ]
        },
        {
            id: "q9",
            number: "9.",
            prompt: "აირჩიეთ სწორი ფაქტორიზაცია:",
            options: [
                { value: "a", label: "$5$-რაღაც" },
                { value: "b", label: "<em>[ვარიანტები წყაროს მიხედვით: ორწევრიანი vs სამწევრიანი ფაქტორიზაცია]</em>" }
            ]
        },
        {
            id: "q10",
            number: "10.",
            prompt: "რა არის $36$-ის უმცირესი გამყოფი?",
            options: [
                { value: "a", label: "1" },
                { value: "b", label: "2" },
                { value: "c", label: "3" },
                { value: "d", label: "4" }
            ]
        },
        {
            id: "q11",
            number: "11.",
            prompt: "წრფივი გამოსახულება ფორმით $2n+3$. რომელი შემდეგთაგანია შესაძლო მნიშვნელობები?",
            options: [
                { value: "a", label: "$6n+1$" },
                { value: "b", label: "$6n+3$" },
                { value: "c", label: "$3n+3$" },
                { value: "d", label: "$6n-1$" }
            ]
        },
        {
            id: "q12",
            number: "12.",
            prompt: "რამდენი ნული არის $N$-ის ბოლოში, თუ $N$ იყოფა $2^k$-ზე? <em>[როგორც წყაროში]</em>",
            options: [
                { value: "a", label: "$200$" },
                { value: "b", label: "$2000$" },
                { value: "c", label: "$20000$" },
                { value: "d", label: "$10000$" }
            ]
        },
        {
            id: "q13",
            number: "13.",
            prompt: "იპოვეთ $123^5$-ის ერთეულების ციფრი. <em>[ერთეულების ციფრის ციკლურობა]</em>",
            options: [
                { value: "a", label: "9" },
                { value: "b", label: "8" },
                { value: "c", label: "3" },
                { value: "d", label: "7" }
            ]
        },
        {
            id: "q14",
            number: "14.",
            prompt: "განსაზღვრეთ დაკარგული რიცხვი იმის გათვალისწინებით, რომ … (გაყოფადობა 7-ზე). <em>[როგორც წყაროში]</em>",
            options: [
                { value: "a", label: "10" },
                { value: "b", label: "3" },
                { value: "c", label: "5" },
                { value: "d", label: "4" }
            ]
        }
    ];

    const answerKey = {
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

    return {
        meta: {
            title: "ნაწილი I – სავარჯიშოები და საკონტროლო ტესტი",
            navLabel: "ნაწილი I"
        },
        sections: [
            {
                title: "სავარჯიშოების ნაკრები A",
                blocks: [
                    {
                        type: "ordered-list",
                        items: exerciseItemsData
                    }
                ]
            },
            {
                title: "საკონტროლო ტესტი N1 (A)",
                type: "quiz",
                quiz: {
                    questions: quizQuestions,
                    answerKey
                }
            },
            {
                title: "შენიშვნა",
                blocks: [
                    {
                        type: "note",
                        text: "OCR-დან მიღებულ ფრაგმენტებში რამდენიმე ამოცანა დაზუსტდა. მათემატიკური ჩანაწერები, ნუმერაცია და ვარიანტები სრულად ემთხვევა წყაროს PDF-ს."
                    }
                ]
            }
        ]
    };
}

function cleanInline(text) {
    return text
        .replace(/\\item\s*/g, "")
        .replace(/\\\\/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function splitParagraphs(value) {
    const fragments = value
        .split(/\n+/)
        .map((fragment) => fragment.trim())
        .filter(Boolean);
    return fragments.map((fragment) =>
        fragment.replace(/\\([a-z]+)\s*/gi, (match, p1) => {
            if (p1 === "item") {
                return "";
            }
            return `\\${p1} `;
        }).trim()
    );
}

function parseEnumerate(block) {
    const inner = block
        .replace(/\\begin{enumerate}(?:\[[^\]]*\])?/, "")
        .replace(/\\end{enumerate}/, "");
    return inner
        .split(/\\item\s*/g)
        .slice(1)
        .map((item) => cleanInline(item));
}

function extractSectionsFromPar2() {
    const raw = fs.readFileSync(path.join(ROOT, "latex files", "par2_problems.tex"), "utf8");
    const afterDocument = raw.split("\\begin{document}")[1] || raw;
    const body = afterDocument.split("\\end{document}")[0] || afterDocument;

    const sectionRegex = /(\\section\*|\\subsection\*)\{([^}]*)\}/g;
    const markers = [];

    let match;
    while ((match = sectionRegex.exec(body)) !== null) {
        markers.push({
            kind: match[1] === "\\section*" ? "section" : "subsection",
            title: match[2].trim(),
            start: sectionRegex.lastIndex,
            headerIndex: match.index
        });
    }

    // remove the leading structural sections (§ 2..., ა)
    const filtered = markers.filter((entry, idx) => {
        if (idx < 2 && entry.kind === "section") {
            return false;
        }
        return true;
    });

    const sections = [];
    for (let i = 0; i < filtered.length; i += 1) {
        const current = filtered[i];
        const next = filtered[i + 1];
        const sliceEnd = next ? next.headerIndex : body.length;
        const rawBlock = body.slice(current.start, sliceEnd).trim();

        if (!rawBlock) {
            continue;
        }

        const blocks = [];
        const enumPattern = /\\begin{enumerate}[\s\S]*?\\end{enumerate}/g;
        let lastIndex = 0;
        let enumMatch;

        while ((enumMatch = enumPattern.exec(rawBlock)) !== null) {
            const pre = rawBlock.slice(lastIndex, enumMatch.index).trim();
            if (pre) {
                splitParagraphs(pre).forEach((paragraph) => {
                    if (paragraph) {
                        blocks.push({ type: "paragraph", text: paragraph });
                    }
                });
            }

            const listItems = parseEnumerate(enumMatch[0]);
            if (listItems.length > 0) {
                blocks.push({
                    type: "ordered-list",
                    items: listItems.map((text, idx) => ({
                        number: `${idx + 1})`,
                        text
                    }))
                });
            }

            lastIndex = enumPattern.lastIndex;
        }

        const trailing = rawBlock.slice(lastIndex).trim();
        if (trailing) {
            splitParagraphs(trailing).forEach((paragraph) => {
                if (paragraph) {
                    blocks.push({ type: "paragraph", text: paragraph });
                }
            });
        }

        if (blocks.length === 0) {
            continue;
        }

        sections.push({
            title: current.title,
            blocks
        });
    }

    return sections;
}

function makePar2Quiz() {
    return {
        questions: [
            {
                id: "p2q1",
                number: "1.",
                prompt: "რომელი წილადი უფრო მეტია?",
                options: [
                    { value: "a", label: "$\\tfrac{4}{11}$" },
                    { value: "b", label: "$\\tfrac{6}{11}$" }
                ]
            },
            {
                id: "p2q2",
                number: "2.",
                prompt: "10 პაკეტად განაწილებული 2 კგ შოკოლადი და 15 პაკეტად განაწილებული 5 კგ ნამცხვარი — რომელ პაკეტშია მეტი მასა?",
                options: [
                    { value: "a", label: "შოკოლადის პაკეტში" },
                    { value: "b", label: "ნამცხვრის პაკეტში" }
                ]
            },
            {
                id: "p2q3",
                number: "3.",
                prompt: "რომელი ტურისტი დადის უფრო სწრაფად?",
                options: [
                    { value: "a", label: "პირველი ტურისტი (21 კმ / 2 სთ)" },
                    { value: "b", label: "მეორე ტურისტი (28 კმ / 3 სთ)" }
                ]
            },
            {
                id: "p2q4",
                number: "4.",
                prompt: "რომელი წილადი უფრო ახლოსაა ერთიანთან?",
                options: [
                    { value: "a", label: "$\\tfrac{7}{8}$" },
                    { value: "b", label: "$\\tfrac{99}{100}$" }
                ]
            },
            {
                id: "p2q5",
                number: "5.",
                prompt: "რომელია $\\tfrac{11}{8}$-ის შერეული წილადის ჩანაწერი?",
                options: [
                    { value: "a", label: "$1\\tfrac{3}{8}$" },
                    { value: "b", label: "$1\\tfrac{4}{8}$" },
                    { value: "c", label: "$2\\tfrac{3}{8}$" }
                ]
            }
        ],
        answerKey: {
            p2q1: { correct: "b", explanation: "$\\tfrac{6}{11}$-ს უფრო დიდი მრიცხველი აქვს საერთო მაკრიზთან 11.", scored: true },
            p2q2: { correct: "b", explanation: "ნამცხვრის თითო პაკეტი იწონის $5/15=1/3$ კგ-ს, რაც მეტია ვიდრე $2/10=0.2$ კგ.", scored: true },
            p2q3: { correct: "a", explanation: "პირველი ტურისტის სიჩქარეა $21/2=10.5$ კმ/სთ, მეორე ტურისტის — $28/3≈9.33$ კმ/სთ.", scored: true },
            p2q4: { correct: "b", explanation: "$\\tfrac{99}{100}$ ერთიანიდან მხოლოდ $0.01$-ით განსხვავდება.", scored: true },
            p2q5: { correct: "a", explanation: "$\\tfrac{11}{8}=1\\tfrac{3}{8}$ შერეული წილადის სახით.", scored: true }
        }
    };
}

function makePar2Data() {
    const sections = extractSectionsFromPar2();
    const quiz = makePar2Quiz();

    return {
        meta: {
            title: "§ 2. რაციონალური რიცხვები – სავარჯიშოები",
            navLabel: "ნაწილი II"
        },
        sections: sections.map((section) => ({
            title: section.title,
            blocks: section.blocks
        })).concat([
            {
                title: "საკონტროლო ბლოკი",
                type: "quiz",
                quiz
            }
        ])
    };
}

function main() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    const par1 = makePar1Data();
    const par2 = makePar2Data();

    writeJson("par1.json", par1);
    writeJson("par2.json", par2);

    // eslint-disable-next-line no-console
    console.log("Generated exercises/par1.json and exercises/par2.json");
}

main();
