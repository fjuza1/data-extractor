const allButtons = document.querySelectorAll('.d-flex.justify-content-center');

async function cancelDeletion() {
    try {
        const btns = [...allButtons].filter(item => item.children.length > 0).map(child => child.children[1]);
        const clickDelete = btns[1].click();
        await new Promise(resolve => setTimeout(resolve, 3000));
        const dialogButtons = document.querySelector('dialog').querySelectorAll('button')[1];
        await dialogButtons.click();
    } catch (error) {
        console.error(error);
    }
}