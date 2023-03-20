document.addEventListener("DOMContentLoaded", function() {

        const connectButton = document.querySelector(".connect");
        const stopConnectingButton = document.querySelector(".stopconnecting");
        let tabInLinkedInPeopleSection = false;
        let tabs;
        let tabPromise = chrome.tabs.query({ active: true, currentWindow: true });
        tabPromise.then(function tabsArrayGeneration(tabsArr){
                tabInLinkedInPeopleSection = tabsArr[0].url.startsWith('https://www.linkedin.com/search/results/people/');
                tabs = tabsArr;
                console.log(tabs);
                chrome.scripting.executeScript({target: {tabId: tabs[0].id, allFrames: false}, files: ["/scripts/content_script.js"]},(res)=>{});
                connectButton.addEventListener('click',clickConnect);
                stopConnectingButton.addEventListener('click',clickStopConnecting);
        });

        chrome.runtime.onMessage.addListener(
                function(response, sender, sendResponse){
                        document.querySelector('h1').innerText = response;
                }
        );
        function clickConnect(){
                console.log('clickConnect Pressed');
                console.log(tabs[0].id);
                if(!tabInLinkedInPeopleSection){
                        chrome.tabs.sendMessage(tabs[0].id,{name: 'notInLinkedInPeoplePage'});
                        return;
                }
                console.log(tabs);
                chrome.tabs.sendMessage(tabs[0].id,{
                        name: 'startConnect'
                });
                connectButton.style.display = 'none';
                stopConnectingButton.style.display = 'block';
        }
        function clickStopConnecting(){

                stopConnectingButton.style.display = 'none';
                connectButton.style.display = 'block';
                console.log(stopConnectingButton.style);
                chrome.tabs.sendMessage(tabs[0].id,{
                        name: 'stopConnecting'
                });
        }
        window.onblur = function(){
                chrome.tabs.sendMessage(tabs[0].id,{
                        name: 'stopConnecting'
                })
        }
});