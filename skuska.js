const allButtons = document.querySelectorAll('.d-flex.justify-content-center');
// dms


async function cancelDeletion() {
    try {
        const btns = [...allButtons].filter(item => item.children.length > 0).map(child => child.children[1]);
        const clickDelete = btns[1].click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dialogButtons = document.querySelector('dialog').querySelectorAll('button')[1];
        await dialogButtons.click();
        return new Promise(resolve => resolve('Nebolo vymazane'));
    } catch (error) {
        console.error(error);
    }
}
// cms 
/*
async function cancelDeletion() {
    try {
        const allSees = [...allButtons]
        const btns = allSees.filter(item => item.children.length > 0).flatMap(child => child.children)
        const clickDelete = btns[0][2].click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dialogButtons = document.querySelectorAll('dialog').querySelectorAll('button')[1];
        await dialogButtons.click();
    } catch (error) {
        console.error(error);
    }
}*/