export class DropDownMenu
{
    actions;

    constructor()
    {
        // Define actions for each button click
        this.actions = {
            action1: () => {
            },
            action2: () => {
                
            },
            action3: () => {
            }
        };
        
        // Add event listeners to each button
        const buttons = document.querySelectorAll('.sidebar-button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                if (this.actions[action]) {
                    this.actions[action]();
                }
            });
        });
    }

    addAction1(method)
    {
        this.actions.action1 = () =>
        {
            method()
        }
    }

    addAction2(method)
    {
        this.actions.action2 = () =>
        {
            method()
        }
    }

    addAction3(method)
    {
        this.actions.action3 = () =>
        {
            method()
        }
    }
    addAction4(method)
    {
        this.actions.action4 = () =>
        {
            method()
        }
    }
}