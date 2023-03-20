function content(){
        console.log("linkedin bot says hello");
        let __timeout;
        chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
                console.log(msg);
                if(msg.name == 'startConnect'){
                        window.setTimeout(()=>{__timeout = findButtonsAndStrtTmr();},4000)
                }
                else if(msg.name == 'notInLinkedInPeoplePage'){
                        window.alert("Go to LinkedIn Search and tap people in order to start the connection");
                }
                else if(msg.name == 'stopConnecting'){
                        window.setTimeout(()=>{clear();},4000);
                }
                else if(msg.name == 'popupClosed'){
                        clearPop();
                }
                sendResponse('done');
        });
        let __it = 0;
        let __con = 0;
        function findButtonsAndStrtTmr(){
                const connectButtons = [...document.querySelectorAll('.artdeco-button')].filter((element)=>{
                        return (element.childNodes  && element.querySelector('span') &&  element.querySelector('span').textContent.includes("Connect"))
                });
                console.log(connectButtons);
                if(connectButtons.length==0){
                        console.log("no buttons found");
                        window.alert("No Connect Buttons found");
                        return;
                }

                console.log(connectButtons);
                const __timeout1 = window.setInterval(async function(){
                        if(connectButtons[__it] && connectButtons[__it].childNodes && connectButtons[__it].childNodes.length>0){
                                if(__it==connectButtons.length - 1){
                                        clear();
                                        return;
                                }

                                connectButtons[__it].click();
                                const adretcopills = [...document.querySelectorAll('.artdeco-pill')].filter((element)=>{return element.textContent.includes("Other")});
                                if(adretcopills.length>0){
                                        console.log('click send button');
                                        adretcopills[0].click();
                                }
                                if((document.querySelector('.artdeco-modal__actionbar'))){
                                        const connectInModal = [...((document.querySelector('.artdeco-modal__actionbar')).querySelectorAll('.artdeco-button'))].filter((element)=>{return element.textContent.includes('Connect')});
                                        if(connectInModal.length>0){
                                                connectInModal[0].click();
                                        }
                                }
                                const sendButtons = [...document.querySelectorAll('.artdeco-button')].filter((element)=>{return element.textContent.includes("Send")});
                                if(sendButtons.length>0){
                                        console.log('click send button');
                                        sendButtons[0].click();
                                        __con++;
                                        chrome.runtime.sendMessage(__con);
                                        __it = (__it + 1)%connectButtons.length;
                                }

                        }

                },5000);
                function clear(){
                        window.clearInterval(__timeout1);

                }
                return __timeout1;
        }
        function clear(){
                if(__timeout)
                        window.clearInterval(__timeout);
                __it = 0;
        }

        function clearPop(){
                if(__timeout)
                        window.clearInterval(__timeout);
                __con = 0;
                __it = 0;
                chrome.runtime.sendMessage(__con)
        }
}
content();