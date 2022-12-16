export default `
/* Anchor Link */

.%prefix% * {
    box-sizing: border-box;
    line-height: 1;
    font-variant-numeric: tabular-nums;
}

.%prefix% {
    font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
        Arial, sans-serif;
    font-size: 13px;
    background: rgba(0, 0, 0, 0.65);
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 2147483647;
    display: none;
    align-items: center;
    justify-content: center;
}

.%prefix%-active {
    display: flex;
}

.%prefix%-inner {
    background: #FFF;
    margin: 20px;
    padding: 24px 0;
    border-radius: 20px;
    box-shadow: 0px 4px 100px rgba(0, 0, 0, .5);
    width: 484px;
    position: relative;
}

.%prefix%-error{
    color: #fc3d39;
    margin-top: 14px;
    line-height: 24px;
}

.%prefix%-close {
    display: block;
    position: absolute;
    top: 28px;
    right: 28px;
    width: 28px;
    height: 28px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M.57 12.1a.96.96 0 000 1.34c.37.36 1 .36 1.34 0L7 8.37l5.09 5.09c.36.35.97.35 1.34-.01a.96.96 0 000-1.34L8.34 7.01l5.08-5.08a.95.95 0 000-1.33.97.97 0 00-1.34-.01L6.99 5.68 1.91.59a.96.96 0 00-1.33 0 .97.97 0 00-.01 1.34l5.09 5.08-5.1 5.1z' fill='%238486A4'/%3E%3C/svg%3E");
    background-size: 14px;
    background-repeat: no-repeat;
    background-position: 50% 7px;
    border-radius: 100%;
    cursor: pointer;
}

.%prefix%-close:hover {
    background-color: white;
}

.%prefix%-version {
    position: absolute;
    top: 19px;
    left: 20px;
    cursor: help;
    color: #B8C0DA;
    opacity: 0.1;
    display: none;
}

.%prefix%-version:hover {
    opacity: 1;
}

.%prefix%-logo {
    width: 70px;
    height: 70px;
    color: #536EF3;
    margin: 0 auto;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 70 70'%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='62.388' y1='4.055' x2='9.311' y2='67.901' gradientTransform='matrix(1 0 0 -1 0 72)'%3E%3Cstop offset='.213' stop-color='%23536ef3'/%3E%3Cstop offset='.995' stop-color='%235d77f7'/%3E%3C/linearGradient%3E%3Cpath d='M35 0c19.3 0 35 15.7 35 35S54.3 70 35 70 0 54.3 0 35 15.7 0 35 0z' fill='url(%23a)'/%3E%3Cpath d='M59.9 49l-22-37.3c-.1-.1-.3-.3-.6-.3h-4.4c-.3 0-.5.2-.6.3L10.1 49c-.1.2-.1.3-.1.4 0 .1 0 .3.1.4l2.2 3.8.2.2h9.2c.3 0 .5-.2.6-.3l2.2-3.8c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-2-3.4 3.4-5.7 8.2 13.7.1.1.1.1c.1.1.2.1.3.1H57c.3 0 .5-.2.6-.3l2.2-3.7c.1-.1.1-.3.1-.4.1-.1.1-.2 0-.4zm-16.1-9.2l1.2 2.1-2.1 3.5-2.3 3.8v.6l.1.1c.1.1.3.3.6.3h16.4l-1.2 2.1H36.4l7.4-12.5zm-24.9 9.3c-.1.1-.1.2-.1.4s.1.3.1.4l.1.1c.1.1.3.3.6.3h3l-1.3 2.2h-6.9l18.4-31 1.2 2.1-4.1 6.9c-.1.1-.1.3-.1.4 0 .1 0 .3.1.4l6.4 10.8-1.3 2.2-5.9-10.1c-.1-.1-.3-.3-.6-.3s-.5.2-.6.3l-6.7 11-2.3 3.9zm12.6-18.3l3.4-5.8 5.7 9.5-3.5 5.9-5.6-9.6zm-3.2 5.5l5.9 10c.1.2.3.3.5.4.2.1.4.1.5 0 .1 0 .2-.1.3-.2.1-.1.1-.2.2-.3l6.6-11.3c.1-.1.1-.3.1-.4 0-.1 0-.3-.1-.4l-8.8-14.7s-.1-.2-.2-.3c-.1-.1-.3-.2-.5-.2-.3 0-.4.1-.5.2-.1.1-.2.2-.2.3L13 51.6l-1.3-2.2 21.1-35.7 18.4 31.1h-2.5l-4.2-7.1c-.2-.2-.4-.4-.7-.4-.3 0-.5.1-.7.4L35 51.6l-7.9-13.2 1.2-2.1zM46 43.4l.8 1.4h-1.7l.9-1.4zm-1.9 3h8.5c.3 0 .5-.2.6-.3.1-.1.2-.3.2-.5 0-.1 0-.3-.1-.4L34.2 12.9h2.5l21.1 35.7h-15l1.3-2.2zM21 48.7l.8-1.3.8 1.3H21z' fill='%23fff'/%3E%3C/svg%3E");
}
.%prefix%-logo.login {
    width: 119px;
    height: 34px;
    background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTE5IiBoZWlnaHQ9IjM0IiB2aWV3Qm94PSIwIDAgMTE5IDM0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0iIzUzNkVGMyIvPgo8cmVjdCB3aWR0aD0iMzQiIGhlaWdodD0iMzQiIHJ4PSIxNyIgZmlsbD0idXJsKCNwYWludDBfbGluZWFyXzYzMV8yNTc1KSIvPgo8bWFzayBpZD0icGF0aC0yLW91dHNpZGUtMV82MzFfMjU3NSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iNC4zMTI1IiB5PSI1LjM3NSIgd2lkdGg9IjI1IiBoZWlnaHQ9IjIyIiBmaWxsPSJibGFjayI+CjxyZWN0IGZpbGw9IndoaXRlIiB4PSI0LjMxMjUiIHk9IjUuMzc1IiB3aWR0aD0iMjUiIGhlaWdodD0iMjIiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNS45NzQ0IDYuMzc1QzE1LjgzMzYgNi4zNzUgMTUuNzU3OSA2LjQ1MDU4IDE1LjcwOTQgNi40OTg4NEwxNS42OTYxIDYuNTEyMTRMNS4zNjkyOSAyNC4zMjM2QzUuMzI3MzIgMjQuMzcyOCA1LjMxMjUgMjQuNDM0OCA1LjMxMjUgMjQuNDkxQzUuMzEyNSAyNC41NTMgNS4zMjk3NiAyNC42MTczIDUuMzU5NjkgMjQuNjc2OUw2LjQwMzI4IDI2LjQ3MjJMNi40OTQgMjYuNTYyNUgxMC44MTE3QzEwLjk1MjQgMjYuNTYyNSAxMS4wMjgyIDI2LjQ4NjkgMTEuMDc2NiAyNi40Mzg3TDExLjA4OTkgMjYuNDI1NEwxMi4xMjM4IDI0LjY0NjhDMTIuMTY1OSAyNC41OTc2IDEyLjE4MDcgMjQuNTM1NSAxMi4xODA3IDI0LjQ3OTNDMTIuMTgwNyAyNC40MTc1IDEyLjE2MzQgMjQuMzUzIDEyLjEzMzUgMjQuMjkzNEwxMS4xNzgxIDIyLjY2MjJMMTIuODMwMyAxOS44NDc4TDE2LjcyOSAyNi40MjU4TDE2Ljc0MDEgMjYuNDM2N0wxNi43NDExIDI2LjQzNzlMMTYuNzQ0MiAyNi40NDA3TDE2Ljc1MzcgMjYuNDQ5M0MxNi43NjE1IDI2LjQ1NTggMTYuNzcyNSAyNi40NjQ2IDE2Ljc4NiAyNi40NzM1QzE2LjgwOTMgMjYuNDg5IDE2Ljg1NiAyNi41MTU4IDE2LjkxMzQgMjYuNTE1OEgyNy4zMzIzQzI3LjQ3MzEgMjYuNTE1OCAyNy41NDg4IDI2LjQ0MDIgMjcuNTk3MyAyNi4zOTJMMjcuNjEwNiAyNi4zNzg3TDI4LjYzMTQgMjQuNjIyNUMyOC42NjQ0IDI0LjU2NzYgMjguNjg3NSAyNC41MTUxIDI4LjY4NzUgMjQuNDY1QzI4LjY4NzUgMjQuNDE0OSAyOC42NzI3IDI0LjM3MjMgMjguNjQ0NiAyNC4zMjM2TDE4LjMxNzcgNi41MTIxNEwxOC4zMDQ0IDYuNDk4ODRDMTguMjU2IDYuNDUwNTggMTguMTgwMiA2LjM3NSAxOC4wMzk0IDYuMzc1SDE1Ljk3NDRaTTI1LjU1NjYgMjIuNTE3MkwxNi41NDc4IDcuMDIzOThIMTcuODMzNUwyNy43OTE1IDI0LjEzNzRIMjAuNTg1M0wyMS4yNDg3IDIzLjAxMDFIMjUuMjY3M0MyNS40MDc5IDIzLjAxMDEgMjUuNDgzOCAyMi45MzQ1IDI1LjUzMjIgMjIuODg2MkwyNS41MzQ5IDIyLjg4MzZDMjUuNTg2MSAyMi44MzI2IDI1LjYwMzcgMjIuNzY0NCAyNS42MDM3IDIyLjcwMzFDMjUuNjAzNyAyMi42NDExIDI1LjU4NjQgMjIuNTc2OCAyNS41NTY2IDIyLjUxNzJaTTIwLjg1NSAxOC45NTI0TDE3LjAwMjYgMjUuNjA4OEwxMy4yNDI5IDE5LjIwMjZMMTMuODYzIDE4LjEyMTZMMTYuNjcyNyAyMi45NTA5QzE2LjcxMzMgMjMuMDI4OSAxNi43ODcgMjMuMDc5NSAxNi44NTk5IDIzLjEwMzdDMTYuOTI3MiAyMy4xMjYgMTcuMDA4NCAyMy4xMzA3IDE3LjA4MjcgMjMuMTAxNEMxNy4xMzAxIDIzLjA5MzkgMTcuMTcwMiAyMy4wNjkzIDE3LjE5ODIgMjMuMDQxM0MxNy4yMjQ4IDIzLjAxNSAxNy4yNDg2IDIyLjk3NzYgMTcuMjU3NSAyMi45MzMxTDIwLjM4NDIgMTcuNTQxOEMyMC40MjYyIDE3LjQ5MjYgMjAuNDQxIDE3LjQzMDYgMjAuNDQxIDE3LjM3NDRDMjAuNDQxIDE3LjMxMjUgMjAuNDIzNyAxNy4yNDgxIDIwLjM5MzkgMTcuMTg4NUwxNi4yNzU2IDEwLjE5NzNDMTYuMjc1NiAxMC4xOTczIDE2LjIxMTEgMTAuMDkxNSAxNi4xNjYyIDEwLjA0NDdDMTYuMTIxMyA5Ljk5NzkyIDE2LjA2NjUgOS45NDk4NyAxNS45NzMzIDkuOTQ5ODdDMTUuODgwMSA5Ljk0OTg3IDE1LjgyNDcgOS45ODgzNiAxNS43ODE0IDEwLjAzODNDMTUuNzM4IDEwLjA4ODIgMTUuNzEzNiAxMC4xMjE1IDE1LjY4NjMgMTAuMTY5NUw2LjY4MTA2IDI1LjYxNThMNi4wMTUzOCAyNC40ODQ4TDE1Ljk3NDQgNy4zNjk2NEwyNC42OTM5IDIyLjM2MTFIMjMuNDA4TDIxLjQyMyAxOC45NTg0TDIxLjQxOSAxOC45NTI1QzIxLjI4MDIgMTguNzQ1MSAyMC45OTM4IDE4Ljc0NSAyMC44NTUgMTguOTUyNFpNMTAuNjA2MSAyNS45NjAzSDcuMjU1MkwxNS45NzM2IDExLjAxNjVMMTYuNTk0MSAxMi4wOTgxTDE0LjY2MjEgMTUuNDQyNUMxNC42MjAyIDE1LjQ5MTggMTQuNjA1NCAxNS41NTM3IDE0LjYwNTQgMTUuNjA5OUMxNC42MDU0IDE1LjY3MTggMTQuNjIyNiAxNS43MzYyIDE0LjY1MjUgMTUuNzk1OEwxNy42NzM2IDIwLjk4MDJMMTcuMDA2MiAyMi4xNTI5TDE0LjE4NzcgMTcuMjYzMUwxNC4xNzQyIDE3LjI0OTdDMTQuMTI1OCAxNy4yMDE1IDE0LjA1IDE3LjEyNTkgMTMuOTA5MyAxNy4xMjU5QzEzLjc2ODYgMTcuMTI1OSAxMy42OTI4IDE3LjIwMTUgMTMuNjQ0NCAxNy4yNDk3TDEzLjYzMTQgMTcuMjYyN0wxMC41MjYzIDIyLjUxMDNMOS40OTI2MSAyNC4zMzUyTDkuNDkwMDQgMjQuMzQwM0M5LjQ2Mzk2IDI0LjM5MjIgOS40NDI2NiAyNC40NDY2IDkuNDQyNjYgMjQuNTA4NkM5LjQ0MjY2IDI0LjU3MDUgOS40NjM5NiAyNC42MjQ5IDkuNDkwMDQgMjQuNjc2OEw5LjQ5ODM3IDI0LjY5MzVMOS41MTQyIDI0LjcwOTJDOS41NjI2MSAyNC43NTc1IDkuNjM4NDIgMjQuODMzMSA5Ljc3OTE0IDI0LjgzMzFIMTEuMjY5NkwxMC42MDYxIDI1Ljk2MDNaTTE1LjMwNzcgMTUuNjA0MkwxNi45NjA5IDEyLjc0NDZMMTkuNjkxMSAxNy4zODA1TDE3Ljk5MzUgMjAuMjg1MkwxNS4zMDc3IDE1LjYwNDJaTTI3LjEyNTkgMjUuODY2OEgxNy41ODExTDIxLjEzNiAxOS44MDM4TDIxLjc1NjMgMjAuODg0OUwyMC43NTgxIDIyLjU1NjhMMTkuNjYyNSAyNC4zNTk2VjI0LjYyNjJMMTkuNjk4OCAyNC42NjI0QzE5Ljc0NzIgMjQuNzEwNyAxOS44MjMgMjQuNzg2MyAxOS45NjM4IDI0Ljc4NjNIMjcuNzQ1OUwyNy4xMjU5IDI1Ljg2NjhaTTIyLjYzMjEgMjIuMzYxMUgyMS42NjcxTDIyLjE2NjIgMjEuNTMyN0wyMi42MzIxIDIyLjM2MTFaTTExLjI2NTcgMjQuMTg0SDEwLjM1NzZMMTAuODExNyAyMy40NDEyTDExLjI2NTcgMjQuMTg0WiIvPgo8L21hc2s+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUuOTc0NCA2LjM3NUMxNS44MzM2IDYuMzc1IDE1Ljc1NzkgNi40NTA1OCAxNS43MDk0IDYuNDk4ODRMMTUuNjk2MSA2LjUxMjE0TDUuMzY5MjkgMjQuMzIzNkM1LjMyNzMyIDI0LjM3MjggNS4zMTI1IDI0LjQzNDggNS4zMTI1IDI0LjQ5MUM1LjMxMjUgMjQuNTUzIDUuMzI5NzYgMjQuNjE3MyA1LjM1OTY5IDI0LjY3NjlMNi40MDMyOCAyNi40NzIyTDYuNDk0IDI2LjU2MjVIMTAuODExN0MxMC45NTI0IDI2LjU2MjUgMTEuMDI4MiAyNi40ODY5IDExLjA3NjYgMjYuNDM4N0wxMS4wODk5IDI2LjQyNTRMMTIuMTIzOCAyNC42NDY4QzEyLjE2NTkgMjQuNTk3NiAxMi4xODA3IDI0LjUzNTUgMTIuMTgwNyAyNC40NzkzQzEyLjE4MDcgMjQuNDE3NSAxMi4xNjM0IDI0LjM1MyAxMi4xMzM1IDI0LjI5MzRMMTEuMTc4MSAyMi42NjIyTDEyLjgzMDMgMTkuODQ3OEwxNi43MjkgMjYuNDI1OEwxNi43NDAxIDI2LjQzNjdMMTYuNzQxMSAyNi40Mzc5TDE2Ljc0NDIgMjYuNDQwN0wxNi43NTM3IDI2LjQ0OTNDMTYuNzYxNSAyNi40NTU4IDE2Ljc3MjUgMjYuNDY0NiAxNi43ODYgMjYuNDczNUMxNi44MDkzIDI2LjQ4OSAxNi44NTYgMjYuNTE1OCAxNi45MTM0IDI2LjUxNThIMjcuMzMyM0MyNy40NzMxIDI2LjUxNTggMjcuNTQ4OCAyNi40NDAyIDI3LjU5NzMgMjYuMzkyTDI3LjYxMDYgMjYuMzc4N0wyOC42MzE0IDI0LjYyMjVDMjguNjY0NCAyNC41Njc2IDI4LjY4NzUgMjQuNTE1MSAyOC42ODc1IDI0LjQ2NUMyOC42ODc1IDI0LjQxNDkgMjguNjcyNyAyNC4zNzIzIDI4LjY0NDYgMjQuMzIzNkwxOC4zMTc3IDYuNTEyMTRMMTguMzA0NCA2LjQ5ODg0QzE4LjI1NiA2LjQ1MDU4IDE4LjE4MDIgNi4zNzUgMTguMDM5NCA2LjM3NUgxNS45NzQ0Wk0yNS41NTY2IDIyLjUxNzJMMTYuNTQ3OCA3LjAyMzk4SDE3LjgzMzVMMjcuNzkxNSAyNC4xMzc0SDIwLjU4NTNMMjEuMjQ4NyAyMy4wMTAxSDI1LjI2NzNDMjUuNDA3OSAyMy4wMTAxIDI1LjQ4MzggMjIuOTM0NSAyNS41MzIyIDIyLjg4NjJMMjUuNTM0OSAyMi44ODM2QzI1LjU4NjEgMjIuODMyNiAyNS42MDM3IDIyLjc2NDQgMjUuNjAzNyAyMi43MDMxQzI1LjYwMzcgMjIuNjQxMSAyNS41ODY0IDIyLjU3NjggMjUuNTU2NiAyMi41MTcyWk0yMC44NTUgMTguOTUyNEwxNy4wMDI2IDI1LjYwODhMMTMuMjQyOSAxOS4yMDI2TDEzLjg2MyAxOC4xMjE2TDE2LjY3MjcgMjIuOTUwOUMxNi43MTMzIDIzLjAyODkgMTYuNzg3IDIzLjA3OTUgMTYuODU5OSAyMy4xMDM3QzE2LjkyNzIgMjMuMTI2IDE3LjAwODQgMjMuMTMwNyAxNy4wODI3IDIzLjEwMTRDMTcuMTMwMSAyMy4wOTM5IDE3LjE3MDIgMjMuMDY5MyAxNy4xOTgyIDIzLjA0MTNDMTcuMjI0OCAyMy4wMTUgMTcuMjQ4NiAyMi45Nzc2IDE3LjI1NzUgMjIuOTMzMUwyMC4zODQyIDE3LjU0MThDMjAuNDI2MiAxNy40OTI2IDIwLjQ0MSAxNy40MzA2IDIwLjQ0MSAxNy4zNzQ0QzIwLjQ0MSAxNy4zMTI1IDIwLjQyMzcgMTcuMjQ4MSAyMC4zOTM5IDE3LjE4ODVMMTYuMjc1NiAxMC4xOTczQzE2LjI3NTYgMTAuMTk3MyAxNi4yMTExIDEwLjA5MTUgMTYuMTY2MiAxMC4wNDQ3QzE2LjEyMTMgOS45OTc5MiAxNi4wNjY1IDkuOTQ5ODcgMTUuOTczMyA5Ljk0OTg3QzE1Ljg4MDEgOS45NDk4NyAxNS44MjQ3IDkuOTg4MzYgMTUuNzgxNCAxMC4wMzgzQzE1LjczOCAxMC4wODgyIDE1LjcxMzYgMTAuMTIxNSAxNS42ODYzIDEwLjE2OTVMNi42ODEwNiAyNS42MTU4TDYuMDE1MzggMjQuNDg0OEwxNS45NzQ0IDcuMzY5NjRMMjQuNjkzOSAyMi4zNjExSDIzLjQwOEwyMS40MjMgMTguOTU4NEwyMS40MTkgMTguOTUyNUMyMS4yODAyIDE4Ljc0NTEgMjAuOTkzOCAxOC43NDUgMjAuODU1IDE4Ljk1MjRaTTEwLjYwNjEgMjUuOTYwM0g3LjI1NTJMMTUuOTczNiAxMS4wMTY1TDE2LjU5NDEgMTIuMDk4MUwxNC42NjIxIDE1LjQ0MjVDMTQuNjIwMiAxNS40OTE4IDE0LjYwNTQgMTUuNTUzNyAxNC42MDU0IDE1LjYwOTlDMTQuNjA1NCAxNS42NzE4IDE0LjYyMjYgMTUuNzM2MiAxNC42NTI1IDE1Ljc5NThMMTcuNjczNiAyMC45ODAyTDE3LjAwNjIgMjIuMTUyOUwxNC4xODc3IDE3LjI2MzFMMTQuMTc0MiAxNy4yNDk3QzE0LjEyNTggMTcuMjAxNSAxNC4wNSAxNy4xMjU5IDEzLjkwOTMgMTcuMTI1OUMxMy43Njg2IDE3LjEyNTkgMTMuNjkyOCAxNy4yMDE1IDEzLjY0NDQgMTcuMjQ5N0wxMy42MzE0IDE3LjI2MjdMMTAuNTI2MyAyMi41MTAzTDkuNDkyNjEgMjQuMzM1Mkw5LjQ5MDA0IDI0LjM0MDNDOS40NjM5NiAyNC4zOTIyIDkuNDQyNjYgMjQuNDQ2NiA5LjQ0MjY2IDI0LjUwODZDOS40NDI2NiAyNC41NzA1IDkuNDYzOTYgMjQuNjI0OSA5LjQ5MDA0IDI0LjY3NjhMOS40OTgzNyAyNC42OTM1TDkuNTE0MiAyNC43MDkyQzkuNTYyNjEgMjQuNzU3NSA5LjYzODQyIDI0LjgzMzEgOS43NzkxNCAyNC44MzMxSDExLjI2OTZMMTAuNjA2MSAyNS45NjAzWk0xNS4zMDc3IDE1LjYwNDJMMTYuOTYwOSAxMi43NDQ2TDE5LjY5MTEgMTcuMzgwNUwxNy45OTM1IDIwLjI4NTJMMTUuMzA3NyAxNS42MDQyWk0yNy4xMjU5IDI1Ljg2NjhIMTcuNTgxMUwyMS4xMzYgMTkuODAzOEwyMS43NTYzIDIwLjg4NDlMMjAuNzU4MSAyMi41NTY4TDE5LjY2MjUgMjQuMzU5NlYyNC42MjYyTDE5LjY5ODggMjQuNjYyNEMxOS43NDcyIDI0LjcxMDcgMTkuODIzIDI0Ljc4NjMgMTkuOTYzOCAyNC43ODYzSDI3Ljc0NTlMMjcuMTI1OSAyNS44NjY4Wk0yMi42MzIxIDIyLjM2MTFIMjEuNjY3MUwyMi4xNjYyIDIxLjUzMjdMMjIuNjMyMSAyMi4zNjExWk0xMS4yNjU3IDI0LjE4NEgxMC4zNTc2TDEwLjgxMTcgMjMuNDQxMkwxMS4yNjU3IDI0LjE4NFoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTUuOTc0NCA2LjM3NUMxNS44MzM2IDYuMzc1IDE1Ljc1NzkgNi40NTA1OCAxNS43MDk0IDYuNDk4ODRMMTUuNjk2MSA2LjUxMjE0TDUuMzY5MjkgMjQuMzIzNkM1LjMyNzMyIDI0LjM3MjggNS4zMTI1IDI0LjQzNDggNS4zMTI1IDI0LjQ5MUM1LjMxMjUgMjQuNTUzIDUuMzI5NzYgMjQuNjE3MyA1LjM1OTY5IDI0LjY3NjlMNi40MDMyOCAyNi40NzIyTDYuNDk0IDI2LjU2MjVIMTAuODExN0MxMC45NTI0IDI2LjU2MjUgMTEuMDI4MiAyNi40ODY5IDExLjA3NjYgMjYuNDM4N0wxMS4wODk5IDI2LjQyNTRMMTIuMTIzOCAyNC42NDY4QzEyLjE2NTkgMjQuNTk3NiAxMi4xODA3IDI0LjUzNTUgMTIuMTgwNyAyNC40NzkzQzEyLjE4MDcgMjQuNDE3NSAxMi4xNjM0IDI0LjM1MyAxMi4xMzM1IDI0LjI5MzRMMTEuMTc4MSAyMi42NjIyTDEyLjgzMDMgMTkuODQ3OEwxNi43MjkgMjYuNDI1OEwxNi43NDAxIDI2LjQzNjdMMTYuNzQxMSAyNi40Mzc5TDE2Ljc0NDIgMjYuNDQwN0wxNi43NTM3IDI2LjQ0OTNDMTYuNzYxNSAyNi40NTU4IDE2Ljc3MjUgMjYuNDY0NiAxNi43ODYgMjYuNDczNUMxNi44MDkzIDI2LjQ4OSAxNi44NTYgMjYuNTE1OCAxNi45MTM0IDI2LjUxNThIMjcuMzMyM0MyNy40NzMxIDI2LjUxNTggMjcuNTQ4OCAyNi40NDAyIDI3LjU5NzMgMjYuMzkyTDI3LjYxMDYgMjYuMzc4N0wyOC42MzE0IDI0LjYyMjVDMjguNjY0NCAyNC41Njc2IDI4LjY4NzUgMjQuNTE1MSAyOC42ODc1IDI0LjQ2NUMyOC42ODc1IDI0LjQxNDkgMjguNjcyNyAyNC4zNzIzIDI4LjY0NDYgMjQuMzIzNkwxOC4zMTc3IDYuNTEyMTRMMTguMzA0NCA2LjQ5ODg0QzE4LjI1NiA2LjQ1MDU4IDE4LjE4MDIgNi4zNzUgMTguMDM5NCA2LjM3NUgxNS45NzQ0Wk0yNS41NTY2IDIyLjUxNzJMMTYuNTQ3OCA3LjAyMzk4SDE3LjgzMzVMMjcuNzkxNSAyNC4xMzc0SDIwLjU4NTNMMjEuMjQ4NyAyMy4wMTAxSDI1LjI2NzNDMjUuNDA3OSAyMy4wMTAxIDI1LjQ4MzggMjIuOTM0NSAyNS41MzIyIDIyLjg4NjJMMjUuNTM0OSAyMi44ODM2QzI1LjU4NjEgMjIuODMyNiAyNS42MDM3IDIyLjc2NDQgMjUuNjAzNyAyMi43MDMxQzI1LjYwMzcgMjIuNjQxMSAyNS41ODY0IDIyLjU3NjggMjUuNTU2NiAyMi41MTcyWk0yMC44NTUgMTguOTUyNEwxNy4wMDI2IDI1LjYwODhMMTMuMjQyOSAxOS4yMDI2TDEzLjg2MyAxOC4xMjE2TDE2LjY3MjcgMjIuOTUwOUMxNi43MTMzIDIzLjAyODkgMTYuNzg3IDIzLjA3OTUgMTYuODU5OSAyMy4xMDM3QzE2LjkyNzIgMjMuMTI2IDE3LjAwODQgMjMuMTMwNyAxNy4wODI3IDIzLjEwMTRDMTcuMTMwMSAyMy4wOTM5IDE3LjE3MDIgMjMuMDY5MyAxNy4xOTgyIDIzLjA0MTNDMTcuMjI0OCAyMy4wMTUgMTcuMjQ4NiAyMi45Nzc2IDE3LjI1NzUgMjIuOTMzMUwyMC4zODQyIDE3LjU0MThDMjAuNDI2MiAxNy40OTI2IDIwLjQ0MSAxNy40MzA2IDIwLjQ0MSAxNy4zNzQ0QzIwLjQ0MSAxNy4zMTI1IDIwLjQyMzcgMTcuMjQ4MSAyMC4zOTM5IDE3LjE4ODVMMTYuMjc1NiAxMC4xOTczQzE2LjI3NTYgMTAuMTk3MyAxNi4yMTExIDEwLjA5MTUgMTYuMTY2MiAxMC4wNDQ3QzE2LjEyMTMgOS45OTc5MiAxNi4wNjY1IDkuOTQ5ODcgMTUuOTczMyA5Ljk0OTg3QzE1Ljg4MDEgOS45NDk4NyAxNS44MjQ3IDkuOTg4MzYgMTUuNzgxNCAxMC4wMzgzQzE1LjczOCAxMC4wODgyIDE1LjcxMzYgMTAuMTIxNSAxNS42ODYzIDEwLjE2OTVMNi42ODEwNiAyNS42MTU4TDYuMDE1MzggMjQuNDg0OEwxNS45NzQ0IDcuMzY5NjRMMjQuNjkzOSAyMi4zNjExSDIzLjQwOEwyMS40MjMgMTguOTU4NEwyMS40MTkgMTguOTUyNUMyMS4yODAyIDE4Ljc0NTEgMjAuOTkzOCAxOC43NDUgMjAuODU1IDE4Ljk1MjRaTTEwLjYwNjEgMjUuOTYwM0g3LjI1NTJMMTUuOTczNiAxMS4wMTY1TDE2LjU5NDEgMTIuMDk4MUwxNC42NjIxIDE1LjQ0MjVDMTQuNjIwMiAxNS40OTE4IDE0LjYwNTQgMTUuNTUzNyAxNC42MDU0IDE1LjYwOTlDMTQuNjA1NCAxNS42NzE4IDE0LjYyMjYgMTUuNzM2MiAxNC42NTI1IDE1Ljc5NThMMTcuNjczNiAyMC45ODAyTDE3LjAwNjIgMjIuMTUyOUwxNC4xODc3IDE3LjI2MzFMMTQuMTc0MiAxNy4yNDk3QzE0LjEyNTggMTcuMjAxNSAxNC4wNSAxNy4xMjU5IDEzLjkwOTMgMTcuMTI1OUMxMy43Njg2IDE3LjEyNTkgMTMuNjkyOCAxNy4yMDE1IDEzLjY0NDQgMTcuMjQ5N0wxMy42MzE0IDE3LjI2MjdMMTAuNTI2MyAyMi41MTAzTDkuNDkyNjEgMjQuMzM1Mkw5LjQ5MDA0IDI0LjM0MDNDOS40NjM5NiAyNC4zOTIyIDkuNDQyNjYgMjQuNDQ2NiA5LjQ0MjY2IDI0LjUwODZDOS40NDI2NiAyNC41NzA1IDkuNDYzOTYgMjQuNjI0OSA5LjQ5MDA0IDI0LjY3NjhMOS40OTgzNyAyNC42OTM1TDkuNTE0MiAyNC43MDkyQzkuNTYyNjEgMjQuNzU3NSA5LjYzODQyIDI0LjgzMzEgOS43NzkxNCAyNC44MzMxSDExLjI2OTZMMTAuNjA2MSAyNS45NjAzWk0xNS4zMDc3IDE1LjYwNDJMMTYuOTYwOSAxMi43NDQ2TDE5LjY5MTEgMTcuMzgwNUwxNy45OTM1IDIwLjI4NTJMMTUuMzA3NyAxNS42MDQyWk0yNy4xMjU5IDI1Ljg2NjhIMTcuNTgxMUwyMS4xMzYgMTkuODAzOEwyMS43NTYzIDIwLjg4NDlMMjAuNzU4MSAyMi41NTY4TDE5LjY2MjUgMjQuMzU5NlYyNC42MjYyTDE5LjY5ODggMjQuNjYyNEMxOS43NDcyIDI0LjcxMDcgMTkuODIzIDI0Ljc4NjMgMTkuOTYzOCAyNC43ODYzSDI3Ljc0NTlMMjcuMTI1OSAyNS44NjY4Wk0yMi42MzIxIDIyLjM2MTFIMjEuNjY3MUwyMi4xNjYyIDIxLjUzMjdMMjIuNjMyMSAyMi4zNjExWk0xMS4yNjU3IDI0LjE4NEgxMC4zNTc2TDEwLjgxMTcgMjMuNDQxMkwxMS4yNjU3IDI0LjE4NFoiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIiBtYXNrPSJ1cmwoI3BhdGgtMi1vdXRzaWRlLTFfNjMxXzI1NzUpIi8+CjxwYXRoIGQ9Ik01My40NDY4IDEwLjI3NjFDNTMuMTYyMyA5LjU2NDggNTIuOTQ5IDguODUzNDggNTIuNzM1NyA4LjA3MTA0SDQ3Ljc1ODlDNDcuNjE2NyA4Ljg1MzQ4IDQ3LjQwMzUgOS41NjQ4IDQ3LjExOSAxMC4zNDcyTDQyLjkyNDIgMjIuNDM5NUM0Mi42Mzk5IDIzLjI5MzEgNDIuMzU1NCAyNC4wNzU1IDQyIDI0Ljg1ODFINDYuNDc5MUM0Ni42MjEyIDI0LjE0NjggNDYuODM0NSAyMy40MzU1IDQ3LjA0NzggMjIuNzI0Mkw0Ny43NTg5IDIwLjM3NjdINTIuODc4MUw1My41ODg5IDIyLjcyNDJDNTMuODAyMiAyMy4zNjQ0IDU0LjA4NjcgMjQuMjg5IDU0LjE1NzcgMjQuODU4MUg1OC41NjU4QzU4LjM1MjUgMjQuMjg5IDU3Ljk5NzEgMjMuNDM1NSA1Ny42NDE2IDIyLjM2ODRMNTMuNDQ2OCAxMC4yNzYxWk00OC42ODMyIDE2Ljk2MjVMNTAuMjQ3MyAxMS41NTY1TDUxLjgxMTYgMTYuOTYyNUg0OC42ODMyWiIgZmlsbD0iIzUzNkVGMyIvPgo8cGF0aCBkPSJNNjYuMTAxMyA4LjA3MThINTkuMzQ3QzU5LjQxOCA5LjQyMzMxIDU5LjM0NyAxMC45MTcxIDU5LjM0NyAxMi4wNTUyVjIxLjg3MTNDNTkuMzQ3IDIyLjg2NzEgNTkuMzQ3IDIzLjg2MyA1OS4yNzU5IDI0Ljg1ODhINjMuMjU3NEM2My4xODYyIDIzLjg2MyA2My4xODYyIDIyLjg2NzEgNjMuMTg2MiAyMS44MDAyVjE5Ljk1MDdINjYuMjQzNkM3MC4wMTE2IDE5Ljk1MDcgNzIuMDczNCAxNy4xMDU0IDcyLjA3MzQgMTMuODMzNEM3Mi4wNzM0IDEzLjc2MjMgNzIuMDczNCAxMy43NjIzIDcyLjA3MzQgMTMuNjkxMkM3MS44NjAzIDEwLjQ5MDMgNjkuMjI5NiA4LjAwMDY3IDY2LjEwMTMgOC4wNzE4Wk02NS44MTcgMTYuNTM2NEg2My4xMTUzVjExLjU1NzJINjUuODE3QzY3LjA5NjYgMTEuNTU3MiA2OC4xNjMxIDEyLjY5NTMgNjguMDkyMSAxMy45NzU3QzY4LjIzNDIgMTUuMzI3MiA2Ny4xNjc4IDE2LjQ2NTMgNjUuODE3IDE2LjUzNjRaIiBmaWxsPSIjNTM2RUYzIi8+CjxwYXRoIGQ9Ik04NC41OTEgMjEuMzAxOEg3Ny45MDc3VjEwLjU2MUM3Ny45MDc3IDEwLjU2MSA3Ny45MDc3IDkuMjgwNjkgNzcuOTc4OSA4LjE0MjU4SDc0LjA2ODRDNzQuMTM5NSA5LjEzODQzIDc0LjEzOTUgOS45MjA4NiA3NC4xMzk1IDEwLjk4NzhWMjEuNjU3NkM3NC4xMzk1IDIyLjcyNDUgNzQuMTM5NSAyMy43OTE2IDc0LjA2ODQgMjQuODU4NEg4Ni4xNTUyQzg2LjE1NTIgMjQuMjE4MiA4Ni4xNTUyIDIzLjUwNjkgODYuMTU1MiAyMi45Mzc4Qzg2LjE1NTIgMjIuNDQgODYuMTU1MiAyMS45NDIgODYuMTU1MiAyMS4zMDE4Qzg1LjQ0NDIgMjEuMzAxOCA4NC41OTEgMjEuMzAxOCA4NC41OTEgMjEuMzAxOFoiIGZpbGw9IiM1MzZFRjMiLz4KPHBhdGggZD0iTTg3LjcxNDYgMTYuODkxN1YyMS43OTk3Qzg3LjcxNDYgMjMuMDgwMSA4Ny43MTQ2IDIzLjc5MTUgODcuNjQzNCAyNC44NTg1SDkxLjQ4MjhDOTEuNDgyOCAyMy45MzM3IDkxLjQ4MjggMjIuODY2OCA5MS40ODI4IDIxLjc5OTdWMTYuODkxN0M5MS40ODI4IDE1LjQ2OTEgOTEuNTUzOCAxMy40Nzc0IDkxLjU1MzggMTIuNTUyN0g4Ny41NzIzQzg3LjY0MzQgMTMuNjE5NyA4Ny43MTQ2IDE1LjYxMTQgODcuNzE0NiAxNi44OTE3WiIgZmlsbD0iIzUzNkVGMyIvPgo8cGF0aCBkPSJNOTEuNTUzNCA4LjA3MTI5SDg3LjY0MzFWMTEuMjcyMkg5MS41NTM0VjguMDcxMjlaIiBmaWxsPSIjNTM2RUYzIi8+CjxwYXRoIGQ9Ik0xMDQuNDk1IDE3LjQ2QzEwNC42MzcgMTYuMzIyIDEwNC4zNTMgMTUuMTgzOCAxMDMuNzEzIDE0LjI1OTFDMTAzLjAwMiAxMy4yNjMzIDEwMS44NjQgMTIuNjIzMSAxMDAuNjU2IDEyLjYyMzFDOTkuMzA0OSAxMi41NTIgOTcuOTUzOSAxMi45MDc2IDk2LjgxNjQgMTMuNzYxMkM5Ni44MTY0IDEzLjQwNTYgOTYuODE2NCAxMi45Nzg4IDk2LjgxNjQgMTIuNjIzMUg5Mi45NzcxQzkzLjA0ODIgMTMuNDc2NyA5My4wNDgyIDE0LjI1OTEgOTMuMDQ4MiAxNS42ODE4VjIxLjg3MDJDOTMuMDQ4MiAyMy4xNTA2IDkzLjA0ODIgMjMuNzE5NyA5Mi45NzcxIDI0LjkyODhIOTYuNzQ1M0M5Ni42NzQzIDIzLjg2MTkgOTYuNjc0MyAyMi43MjM3IDk2LjY3NDMgMjEuNTg1N1YxOC4xMDAyQzk2LjgxNjQgMTcuMzE3OCA5Ny4zMTQgMTYuNjc3NiA5OC4wOTYyIDE2LjM5MzFDOTguODA3MSAxNi4wMzc0IDk5LjY2MDMgMTYuMTA4NiAxMDAuMyAxNi42MDY1QzEwMC45NCAxNy4xNzU2IDEwMC44NjkgMTguMTcxMyAxMDAuODY5IDE5LjIzODRDMTAwLjg2OSAxOS45NDk3IDEwMC44NjkgMjIuMTU0OCAxMDAuODY5IDIyLjE1NDhDMTAwLjg2OSAyMy40MzUgMTAwLjg2OSAyMy45MzMgMTAwLjg2OSAyNC45OTk5SDEwNC40OTVDMTA0LjQyNCAyNC4wNzUyIDEwNC40MjQgMjMuMTUwNiAxMDQuNDI0IDIyLjAxMjRWMTcuNDZIMTA0LjQ5NVoiIGZpbGw9IiM1MzZFRjMiLz4KPHBhdGggZD0iTTExNi45MzggMjIuMjk3NUwxMTMuNTk3IDE3LjYwMjdMMTE2LjUxMiAxNC41NDQxQzExNy41NzggMTMuNDc3MSAxMTcuNzkxIDEzLjI2MzcgMTE4LjU3MyAxMi41NTI0SDExMy41MjZDMTEzLjAyOCAxMy4yNjM3IDExMi40NTkgMTMuOTAzOSAxMTEuODE5IDE0LjU0NDFMMTA5LjgyOCAxNi42MDY5VjExLjA1ODdDMTA5LjgyOCA5LjcwNzE1IDEwOS44OTkgOC45OTU4MyAxMDkuODk5IDhMMTA1LjkxOCA4LjA3MTEzQzEwNi4yMDIgOC43ODI0MyAxMDYuMzQ1IDkuNjM2MDIgMTA2LjI3NCAxMC40MTg1VjIxLjc5OTVDMTA2LjI3NCAyMy4xNTEgMTA2LjI3NCAyMy42NDkgMTA2LjIwMiAyNC44NTgxSDEwOS45NzFDMTA5Ljg5OSAyNC4wMDQ2IDEwOS44OTkgMjMuNTc3NyAxMDkuODk5IDIxLjk0MTdWMjEuMTU5M0wxMTEuMjUgMjAuMDIxM0wxMTIuNjAxIDIyLjE1NTJDMTEzLjA5OSAyMy4wMDg4IDExMy41MjYgMjMuNjQ5IDExNC4yMzYgMjQuOTI5MkgxMTlDMTE4LjA3NiAyNC4wMDQ2IDExNy42NDkgMjMuMjkzMiAxMTYuOTM4IDIyLjI5NzVaIiBmaWxsPSIjNTM2RUYzIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9InBhaW50MF9saW5lYXJfNjMxXzI1NzUiIHgxPSIzMC40NTA2IiB5MT0iMzIuODc5MSIgeDI9IjQuNjcwMzMiIHkyPSIxLjg2ODEzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIG9mZnNldD0iMC4yMTM1NDIiIHN0b3AtY29sb3I9IiM1MzZFRjMiLz4KPHN0b3Agb2Zmc2V0PSIwLjk5NDc5MiIgc3RvcC1jb2xvcj0iIzVENzdGNyIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=");
}


.%prefix%-logo.loading {
    border-radius: 100%;
    background-color: #3650A2;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0.5 0.5 45 45' xmlns='http://www.w3.org/2000/svg' stroke='%23fff'%3E%3Cg fill='none' fill-rule='evenodd' transform='translate(1 1)' stroke-width='2'%3E%3Ccircle cx='22' cy='22' r='6' stroke-opacity='0'%3E%3Canimate attributeName='r' begin='1.5s' dur='3s' values='6;22' calcMode='linear' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='1.5s' dur='3s' values='1;0' calcMode='linear' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-width' begin='1.5s' dur='3s' values='2;0' calcMode='linear' repeatCount='indefinite' /%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='6' stroke-opacity='0'%3E%3Canimate attributeName='r' begin='3s' dur='3s' values='6;22' calcMode='linear' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-opacity' begin='3s' dur='3s' values='1;0' calcMode='linear' repeatCount='indefinite' /%3E%3Canimate attributeName='stroke-width' begin='3s' dur='3s' values='2;0' calcMode='linear' repeatCount='indefinite' /%3E%3C/circle%3E%3Ccircle cx='22' cy='22' r='8'%3E%3Canimate attributeName='r' begin='0s' dur='1.5s' values='6;1;2;3;4;5;6' calcMode='linear' repeatCount='indefinite' /%3E%3C/circle%3E%3C/g%3E%3C/svg%3E");
}

.%prefix%-logo.error {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' fill='none'%3E%3Ccircle cx='35' cy='35' r='35' fill='%23fc3d39'/%3E%3Cpath fill-rule='evenodd' d='M32.88 17.614c.715-.403 1.522-.614 2.343-.614s1.628.212 2.343.614 1.314.983 1.74 1.685l.005.008 13.483 22.508.013.022c.417.722.638 1.541.64 2.375s-.214 1.654-.627 2.378-1.008 1.328-1.727 1.751-1.535.65-2.369.659h-.017-26.983c-.834-.009-1.651-.237-2.369-.659s-1.314-1.027-1.727-1.751-.629-1.544-.627-2.378.223-1.653.64-2.375l.013-.022L31.14 19.299c.426-.702 1.025-1.282 1.74-1.685zm2.343 2.569a1.59 1.59 0 0 0-1.359.763L20.392 43.438a1.59 1.59 0 0 0-.208.782c-.001.278.071.551.209.793a1.59 1.59 0 0 0 1.358.803h26.945a1.59 1.59 0 0 0 1.358-.803 1.59 1.59 0 0 0 .209-.793c-.001-.274-.073-.544-.208-.782L36.584 20.95c-.144-.236-.343-.428-.58-.561a1.59 1.59 0 0 0-.781-.205zm0 6.531a1.59 1.59 0 0 1 1.592 1.592v6.367a1.59 1.59 0 1 1-3.184 0v-6.367a1.59 1.59 0 0 1 1.592-1.592zm-1.592 14.326a1.59 1.59 0 0 1 1.592-1.592h.016a1.59 1.59 0 1 1 0 3.184h-.016a1.59 1.59 0 0 1-1.592-1.592z' fill='%23fff'/%3E%3C/svg%3E");
}

.%prefix%-logo.warning {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' fill='none' %3E%3Ccircle cx='35' cy='35' r='35' fill='%23f8b826'/%3E%3Cpath d='M35 20c-8.284 0-15 6.716-15 15s6.716 15 15 15 15-6.716 15-15-6.716-15-15-15zM16.667 35c0-10.125 8.208-18.333 18.333-18.333S53.333 24.875 53.333 35 45.125 53.334 35 53.334 16.667 45.126 16.667 35zM35 26.667c.921 0 1.667.746 1.667 1.667V35A1.67 1.67 0 0 1 35 36.667c-.921 0-1.667-.746-1.667-1.667v-6.667c0-.921.746-1.667 1.667-1.667zm-1.667 15A1.67 1.67 0 0 1 35 40h.017c.921 0 1.667.746 1.667 1.667s-.746 1.667-1.667 1.667H35a1.67 1.67 0 0 1-1.667-1.667z' fill-rule='evenodd' fill='%23fff'/%3E%3C/svg%3E");
}

.%prefix%-logo.success {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 70 70'%3E%3Cdefs/%3E%3Ccircle cx='35' cy='35' r='35' fill='%233DC55D'/%3E%3Cpath fill='%23fff' d='M30.9 49.7a2 2 0 001.8-1L48 24.9c.3-.5.4-1 .4-1.4 0-1-.7-1.7-1.7-1.7-.8 0-1.2.3-1.6 1L30.8 45.4 23.5 36c-.5-.6-1-.9-1.6-.9-1 0-1.8.8-1.8 1.8 0 .4.2.9.6 1.3L29 48.7c.6.7 1.1 1 1.9 1z'/%3E%3C/svg%3E");
}

.%prefix%-logo.fuel {
    background-image: url("data:image/svg+xml,%3Csvg width='70' height='70' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0)'%3E%3Cpath d='M69.23 30.31l-8.46-11a6.58 6.58 0 00-3.4-2.19L35.91 12.1a7.16 7.16 0 00-1.6-.16 7.73 7.73 0 00-2.18.28l-5.1 1.57a1.76 1.76 0 00-.17-1.4l-1.46-2.5a1.76 1.76 0 00-2.06-.8l-9.98 3.2a1.76 1.76 0 00-1.23 1.74l.13 3.39c.01.27.09.54.22.78l-2.28.7a5.85 5.85 0 00-3.24 2.7L.48 34.23a4.96 4.96 0 00.14 4.53l3.5 5.83a4.49 4.49 0 004.19 2.05l9.29-1.13a4.79 4.79 0 002.54 3.78l3.55 1.68a8.9 8.9 0 003.39.73h.27l8.06-.45c.26.04.5.13.73.28l8.02 8c1 .92 2.3 1.45 3.67 1.47.14 0 .28 0 .42-.03l6.6-.68a2.85 2.85 0 002.5-1.8c.36-1 .1-2.12-.73-3l-2.78-2.96 5.26-1.56a4.35 4.35 0 003-3.64l.41-4.29c.09-.42.26-.82.52-1.16l6-6.66a3.91 3.91 0 00.2-4.9z' fill='%23fff'/%3E%3Cpath d='M49.08 29.96a1.72 1.72 0 00-.92-2.25 1.72 1.72 0 00-1.3 3.17 1.7 1.7 0 002.22-.92zM27.54 26.41a1.02 1.02 0 001-1.23 1.02 1.02 0 00-1.85-.37 1.03 1.03 0 00.46 1.52c.12.05.25.08.39.08zM37.05 21.67a1.03 1.03 0 000-2.06 1.03 1.03 0 000 2.06zM21.54 35c-4.62 0-10.44 2.04-13.52 3.24a.68.68 0 00-.24.16.68.68 0 00-.18.53c.01.1.04.19.1.27l1.28 2.16c.07.1.17.2.28.25.11.06.24.08.37.07l9.15-1.13.45-.03a3.64 3.64 0 013.67 3.55v.3a.67.67 0 00.39.59l2.9 1.38c.42.16.86.26 1.3.28h.05l7.74-.45h.23c1.45.03 2.83.59 3.9 1.58l7.68 7.65c.1.06.22.1.35.12l1.67-.2c.06-.01.12-.03.16-.07a.32.32 0 00.1-.13.33.33 0 00-.03-.33l-.82-1.21a3.22 3.22 0 01-.01-4.58c.4-.4.9-.68 1.45-.82l6.47-1.92a.4.4 0 00.19-.13.41.41 0 00.08-.22l.35-3.53c.01-.06 0-.13-.02-.2a.41.41 0 00-.28-.24.37.37 0 00-.2.01c-2.27.62-6.27 1.6-8.73 1.6C37.4 43.53 29.68 35 21.54 35zm8.97 7.49a.8.8 0 01-.27.28c-.2.13-.45.19-.68.17a1.05 1.05 0 01-.77-1.62.73.73 0 01.28-.28 1.05 1.05 0 011.44 1.45zm17.6 3.72a.76.76 0 01-.27.28 1.05 1.05 0 01-1.17-1.73 1.05 1.05 0 011.32.13 1.04 1.04 0 01.13 1.32z' fill='%23F8B826'/%3E%3Cpath d='M21.54 35c-4.85 0-11.03 2.25-13.96 3.42a.29.29 0 00-.15.16c-.01.03-.02.07-.01.11 0 .04.01.07.03.1L9 41.38c.06.11.16.2.27.26.12.05.25.07.37.06l9.15-1.13c.15-.02.3-.02.46-.03a3.63 3.63 0 013.66 3.54l.02.56c0 .04.02.09.05.13.02.04.06.07.1.1l3.13 1.48c.41.16.85.26 1.3.28h.04l7.74-.45h.23c1.45.03 2.84.59 3.9 1.58l7.68 7.65c.1.06.23.1.35.12l2.22-.27-1.58-1.66c-.82-.88-.7-2.05-.4-3.13a3.28 3.28 0 012.3-2.27l6.71-2 .38-3.8.06-.58c-2.13.59-6.6 1.74-9.3 1.74C37.4 43.54 29.69 35 21.54 35zm8.89 7.62a.38.38 0 01-.07.07c-1.07.77-2.26-.42-1.49-1.5a.25.25 0 01.06-.07c1.08-.77 2.27.42 1.5 1.5zm17.6 3.72a.25.25 0 01-.06.06c-1.07.78-2.26-.42-1.49-1.5a.25.25 0 01.07-.06c1.07-.78 2.26.42 1.49 1.5z' fill='%23E99123'/%3E%3Cpath d='M47.53 34.9c-10.41 0-19.22-4.65-25.54-4.65-4.44 0-11.97 3.38-15.28 5.83a.55.55 0 00-.18.69l.35.78a.55.55 0 00.72.28c2.84-1.18 8.9-3.42 13.94-3.42 8.4 0 16.15 7.48 25.16 7.48 4 0 9.88-1.58 11.41-2.82.67-.7 2.86-3.32 4.4-4.93a.67.67 0 00.1-.8.67.67 0 00-.32-.28.65.65 0 00-.42-.03 64.85 64.85 0 01-14.34 1.86zm-.47 3.95c-.14.3-.38.55-.68.7a1.73 1.73 0 01-2.34-2.36c.14-.3.38-.55.68-.7a1.72 1.72 0 012.04.32 1.75 1.75 0 01.3 2.04z' fill='%23F8B826'/%3E%3Cpath d='M68.34 30.87l-8.46-11a5.52 5.52 0 00-2.77-1.78l-21.46-5.03a7.08 7.08 0 00-3.2.1l-7.55 2.3-.01.01h-.01l-.5-1.3v-.01l1.13-.4a.65.65 0 00.36-.93l-1.47-2.5a.64.64 0 00-.73-.27l-9.98 3.17a.64.64 0 00-.44.63l.13 3.39a.64.64 0 00.63.6c.07 0 .15-.02.22-.04l2.53-.91h.02l.44.87v.02l-6.7 2.05c-1.08.38-2 1.15-2.56 2.15L1.47 34.61a3.8 3.8 0 00.11 3.43l3.5 5.84a3.32 3.32 0 003.1 1.51l10.23-1.26a.2.2 0 01.2.04.2.2 0 01.06.08l.02.1.03.9a3.69 3.69 0 001.9 2.88l3.56 1.69c.98.42 2.05.63 3.12.61l8.06-.44c.58.02 1.13.23 1.57.6l8.03 8a4.38 4.38 0 003.18 1.12l6.6-.69c.77-.07 1.33-.46 1.55-1.07.23-.6.05-1.26-.48-1.82l-4.02-4.26-.01-.01v-.01l7-2.09a3.25 3.25 0 002.2-2.66l.43-4.3a4 4 0 01.8-1.81l6.01-6.67a2.76 2.76 0 00.12-3.45zM15.14 15.2l-.03-.51c0-.08.02-.16.06-.22.04-.07.1-.11.18-.14l7.73-2.5a.35.35 0 01.41.16l.13.23c.03.05.04.1.05.15 0 .05 0 .1-.02.14a.35.35 0 01-.08.13.38.38 0 01-.12.09L15.6 15.5a.34.34 0 01-.31-.04.36.36 0 01-.16-.27zm51.53 17.75l-6 6.66a5.95 5.95 0 00-1.32 3l-.42 4.3a1.22 1.22 0 01-.73.87l-7.32 2.17a1.8 1.8 0 00-1.34 2.28c.1.32.27.6.52.83l3.19 3.37a.4.4 0 01.09.43.42.42 0 01-.14.19.42.42 0 01-.21.08l-5.06.53c-.55 0-1.09-.19-1.51-.54l-8.03-8a4.62 4.62 0 00-3.14-1.2l-8.07.45c-.73.01-1.45-.13-2.12-.41l-3.56-1.7a1.4 1.4 0 01-.72-1.08l-.04-.9a2.35 2.35 0 00-.8-1.68 2.24 2.24 0 00-1.78-.53L7.92 43.32a1.32 1.32 0 01-1.07-.53l-3.49-5.82a1.78 1.78 0 01-.05-1.4L9.8 22.94c.32-.5.78-.89 1.33-1.1l21.94-6.67c.69-.18 1.42-.2 2.12-.07l21.46 5.02c.62.19 1.18.55 1.6 1.03l8.47 11c.08.11.12.25.12.4a.69.69 0 01-.16.39z' fill='%2329363F'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0'%3E%3Cpath fill='%23fff' transform='translate(0 9)' d='M0 0h70v52H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
}

.%prefix%-request {
    padding: 20px 52px;
    border-radius: 20px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    background: white;
}
.%prefix%-request.login{
    padding-top: 0;
    padding-bottom: 0;
}
.%prefix%-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.%prefix%-title {
    color: #000000;
    font-size: 25px;
    margin: 20px auto;
    font-weight: 700;
    line-height: 30px;
    letter-spacing: 0.5px;
}

.%prefix%-subtitle {
    margin-top: 14px;
    color: #8486A4;
    text-align: center;
    line-height: 1.4;
    word-break: break-word;
    font-size: 16px;
}

.%prefix%-subtitle a {
    color: #000000;
    cursor: pointer;
    text-decoration: underline;
}

.%prefix%-manual {
    color: #007AFF;
    cursor: pointer;
    
}

.%prefix%-info hr {
    border: 0;
    height: 1px;
    width: 100%;
    background: #EFF1F7;
    margin: 24px 0 14px;
}

.%prefix%-uri {
    width: 100%;
}

.%prefix%-button {
    color: #FFF;
    background: #536EF3;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    flex-grow: 1;
    flex: 1;
    width: 100%;
    line-height:  40px;
    height: 40px;
    border-radius: 8px;
    text-align: center;
    display: block;
    margin-top: 14px;
    cursor: pointer;
    display:none;
}

.%prefix%-button:hover {
  background: 
}

.%prefix%-qr {
    position: relative;
    width: 100%;
    margin-top: 14px;
    border-radius: 12px;
    background: #FFFFFF;
    transition: all 400ms ease-in-out;
    transform: scale(1) translateY(0);
}

.%prefix%-qr svg {
    width: 100%;
    display: block;
    cursor: zoom-in;
    shape-rendering: crispEdges;
}

.%prefix%-qr.zoom {
    transform: scale(2) translateY(-25px);
    border: 2px solid #536EF3;
    box-sizing: border-box;
    box-shadow: 0px 4px 154px rgba(0, 0, 0, 0.35);
    border-radius: 8px;
    padding: 5px;
    z-index: 2147483647;
}

.%prefix%-qr.zoom svg {
    cursor: zoom-out;
}

.%prefix%-qr svg rect {
    fill: black;
}

.%prefix%-copy {
    margin-top:14px;
    width: 100%;
    color: #8486A4;
    text-align: center;
    opacity: 1;
    transition: all 200ms ease-in-out;
    transition-delay: 400ms;
    font-size:14px;
}

.%prefix%-qr.zoom .%prefix%-copy {
    transition-delay: 0ms;
    background: transparent;
    opacity: 0;
}

.%prefix%-copy span,
.%prefix%-copy a {
    display: inline-block;
    background: white;
    padding: 0 20px;
    color: #8486A4;
    cursor: pointer;
    text-decoration: none;
}

.%prefix%-copy span {
    display: none;
    color: #5C5C5C;
    cursor: default;
}

.%prefix%-copy.copied a {
    display: none;
}

.%prefix%-copy.copied span {
    display: inline-block;
}

.%prefix%-download{
    color: #070847;
    font-size: 14px;
    margin-top:18px;
}

.%prefix%-download a{
    color: #536EF3;
    text-decoration: none;
}

// .%prefix%-copy span:before,
// .%prefix%-copy a:before {
//     content: '';
//     display: inline-block;
//     width: 26px;
//     height: 16px;
//     position: relative;
//     top: 2px;
//     background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17' fill='none'%3E%3Cg clip-path='url(%23A)' stroke='%23157efa' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M13.83 6.5h-6c-.73 0-1.33.6-1.33 1.33v6c0 .74.6 1.34 1.33 1.34h6c.74 0 1.34-.6 1.34-1.34v-6c0-.73-.6-1.33-1.34-1.33z'/%3E%3Cpath d='M3.83 10.5h-.66a1.33 1.33 0 01-1.34-1.33v-6a1.33 1.33 0 011.34-1.34h6a1.33 1.33 0 011.33 1.34v.66' stroke-linecap='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='A'%3E%3Cpath fill='%23fff' transform='translate(.5 .5)' d='M0 0h16v16H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
//     background-repeat: no-repeat;
// }

.%prefix%-copy span:before {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.33 4L6 11.33 2.67 8' stroke='%23157EFA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    top: 3.5px;
}

.%prefix%-footnote {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: -26px;
    left: 0;
    color: white;
    display: none;
}

.%prefix%-footnote  .%prefix%-download {
    color: white;
}

.%prefix%-wskeepalive {
    display: none;
}

@media (prefers-color-scheme: dark) {
    .%prefix%-info hr,
    .%prefix%-inner {
        background: #262D43;
        color: white;
    }
    .%prefix%-request,
    .%prefix%-qr a,
    .%prefix%-qr span,
    .%prefix%-qr {
        background: #131B33;
    }
    .%prefix%-title {
        color: #FCFCFC;
    }
    .%prefix%-qr span,
    .%prefix%-subtitle {
        color: #B8C0DA;
    }
    .%prefix%-subtitle a {
        color: #FCFCFC;
    }
    .%prefix%-qr svg rect {
        fill: white;
    }
    .%prefix%-version {
        color: #546AAF;
    }
    .%prefix%-qr a,
    .%prefix%-manual,
    .%prefix%-button {
        color: #FCFCFC;
    }
    .%prefix%-button {
        background: #262D43;
        border: 1px solid #262D43;
    }
    .%prefix%-qr {
        border-color: #262D43;
    }
    .%prefix%-qr.zoom {
        border-color: #536EF3;
    }
    .%prefix%-copy a:before {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17' fill='none'%3E%3Cg clip-path='url(%23A)' stroke='%23fff' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M13.83 6.5h-6c-.73 0-1.33.6-1.33 1.33v6c0 .74.6 1.34 1.33 1.34h6c.74 0 1.34-.6 1.34-1.34v-6c0-.73-.6-1.33-1.34-1.33z'/%3E%3Cpath d='M3.83 10.5h-.66a1.33 1.33 0 01-1.34-1.33v-6a1.33 1.33 0 011.34-1.34h6a1.33 1.33 0 011.33 1.34v.66' stroke-linecap='round'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='A'%3E%3Cpath fill='%23fff' transform='translate(.5 .5)' d='M0 0h16v16H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
    }
    .%prefix%-copy span:before {
        background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.33 4L6 11.33 2.67 8' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    }
    .%prefix%-button:hover {
        color: #FCFCFC;
        border: 1px solid #FCFCFC;
        background: #333A50;
    }
    .%prefix%-close {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M.57 12.1a.96.96 0 000 1.34c.37.36 1 .36 1.34 0L7 8.37l5.09 5.09c.36.35.97.35 1.34-.01a.96.96 0 000-1.34L8.34 7.01l5.08-5.08a.95.95 0 000-1.33.97.97 0 00-1.34-.01L6.99 5.68 1.91.59a.96.96 0 00-1.33 0 .97.97 0 00-.01 1.34l5.09 5.08-5.1 5.1z' fill='%23FCFCFC'/%3E%3C/svg%3E");
    }
    .%prefix%-close:hover {
        background-color: black;
    }
}

// @media (max-height: 600px) { .%prefix%-inner { transform: scale(0.9); } }
@media (max-height: 540px) { .%prefix%-inner { transform: scale(0.8); } }
@media (max-height: 480px) { .%prefix%-inner { transform: scale(0.7); } }
@media (max-height: 420px) { .%prefix%-inner { transform: scale(0.6); } }
@media (max-height: 360px) { .%prefix%-inner { transform: scale(0.5); } }
@media (max-height: 300px) { .%prefix%-inner { transform: scale(0.4); } }

@media (max-width: 600px) and (orientation: portrait) {
    .%prefix%-qr.zoom {
        transform: scale(1.5) translateY(-25px);
    }
    .%prefix%-info .%prefix%-download {
        display:none;
    }
    .%prefix%-button {
        display: block;
    }

    .%prefix%-footnote  {
        display: block;
    }

    .%prefix%-request{
        padding-left: 24px;
        padding-right: 24px;
    }
    .%prefix%-subtitle{
        font-size: 14px;
    }
    .%prefix%-close{
        display: none;
    }
}

@media (max-width: 450px) and (orientation: portrait) {
    .%prefix%-qr.zoom {
        transform: scale(1.3) translateY(-25px);
    }
}

`
