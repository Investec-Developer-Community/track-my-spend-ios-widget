/*
|--------------------------------------------------------------------------
| Application Config
|--------------------------------------------------------------------------
|
| Modify the configurations below to match the credentials on your account.
|
*/
const CLIENT_ID = 'ENTER_YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = 'ENTER_YOUR_CLIENT_SECRET_HERE';
const API_KEY = 'ENTER_YOUR_API_KEY_HERE';

/****************************************
 * NO EDITS REQUIRED BEYOND THIS LINE
 ****************************************
*/

const dateFormatter = new DateFormatter();
dateFormatter.dateFormat = 'yyyy-MM-dd';
const dateToday = dateFormatter.string(new Date());

const getToken = async () => {

    const request = new Request('https://openapi.investec.com/identity/v2/oauth2/token');

    const authValues = CLIENT_ID + ':' + CLIENT_SECRET;
    const as64 = Data.fromString(authValues).toBase64String();

    request.headers = {
        'Authorization': `Basic ${as64}`,
        'Content-type': 'application/x-www-form-urlencoded',
        'x-api-key': API_KEY,
        'Accept': 'application/json',
    };
    request.method = 'POST';
    request.body = 'grant_type=client_credentials&scope=accounts';

    try {
        const result = await request.loadJSON();
        // maybe save to keychain in the future?
        return result.access_token;
    } catch (err) {
        throw err;
    }

}

const getAccount = async(token) => {  
    const request = new Request('https://openapi.investec.com/za/pb/v1/accounts');
    request.headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    };

    try {
        const result = await request.loadJSON();
        return result.data.accounts[0].accountId;
    } catch (err) {
        throw err;
    }
}

const getTransactions = async(token) => {
    // todo: maybe store accountId in keychain
    const accountId = await getAccount(token);
    const request = new Request(`https://openapi.investec.com/za/pb/v1/accounts/${accountId}/transactions?fromDate=${dateToday}&toDate=${dateToday}`);
    request.headers = {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
    };

    try {
        const result = await request.loadJSON();
        return result.data.transactions;
    } catch (err) {
        throw err;
    }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2
});

function addTransactionWidget(widget, amount, narration) {
    addParagraph(widget, `${currencyFormatter.format(amount)} - ${narration}`);  
}

function addParagraph(widget, content) {
    const text = widget.addText(content);  
    text.textOpacity = 0.8;
    text.font = Font.footnote();
    text.leftAlignText();
}

function addParagraphTitle(widget, content) {
    const text = widget.addText(content);  
    text.textOpacity = 1;
    text.font = Font.semiboldSystemFont(20);
    text.leftAlignText();  
    widget.addSpacer(10);
}

function addTitle(widget, content) {
    const title = widget.addText(content);  
    title.font = Font.semiboldSystemFont(16);
    title.textOpacity = 0.8;
    title.centerAlignText();
}

function addHero(widget, content) {
    const text = widget.addText(content);
    text.font = Font.semiboldSystemFont(32);
    text.centerAlignText();
}

function createDefaultWidget() {
    const widget = new ListWidget();
    // Widget background
    const startColor = new Color('#000000');
    const endColor = new Color('#000000');
    let gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0.0, 1];
    widget.backgroundGradient = gradient;
    return widget;    
}

function showTransactions(transactions) {
    const widget = createDefaultWidget();
    
    let totalSpentToday = 0;
    let recentTransactions = [];

    if (transactions.length > 0) {
        const daysTransactions = transactions.filter(t => t.postingDate === dateToday && t.type === 'DEBIT');
        recentTransactions = daysTransactions.slice(0, 5);
        totalSpentToday = daysTransactions.map(t => t.amount).reduce((total, item) => total + item, 0);
    }

    addTitle(widget, "Today's Spend");
    addHero(widget, currencyFormatter.format(totalSpentToday));
    widget.addSpacer(20);

    if (recentTransactions.length > 0) {
        addParagraphTitle(widget, 'Recent Transactions');
    }

    for (transaction of recentTransactions) {
        widget.addSpacer(6);
        addTransactionWidget(widget, transaction.amount, transaction.description);
    }

    return widget;
}

function showError(message) {
    const widget = createDefaultWidget();

    addHero(widget, 'ERROR');
    addParagraphTitle(widget, 'Details');
    addParagraph(widget, message);
    return widget;
}

if (config.runsInWidget) {
    let widget;

    let transactions = [];
    try {
        const token = await getToken();
        transactions = await getTransactions(token);
        widget = showTransactions(transactions);
    } catch (err) {
        widget = showError(err.message);
    }

    Script.setWidget(widget);
    Script.complete();
}
