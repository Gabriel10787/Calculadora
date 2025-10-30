// GitHub 
        (function(){
            const displayEl = document.getElementById('display');
            const exprEl = document.getElementById('expr');
            const memEl = document.getElementById('mem');

            let expression = ''; // visible smaller expression
            let current = '0';   // main display
            let memory = 0;
            let lastEval = null; // store last result
            let justEvaluated = false;

            function updateScreen(){
                exprEl.textContent = expression;
                displayEl.textContent = current;
                memEl.textContent = memory !== 0 ? 'M' : '';
            }

            function sanitizeForEval(s){
                // replace visual operators and remove unexpected chars
                s = s.replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-');
                // allow digits, operators, parentheses, dot, space
                if(!/^[0-9+\-*/().\s%]*$/.test(s)) throw new Error('Entrada inválida');
                return s;
            }

            function computeExpression(fullExpr){
                try{
                    const safe = sanitizeForEval(fullExpr);
                    // evaluate using Function (faster than eval) — input validated above
                    // replace consecutive % patterns: we won't implement % as modulo here
                    // But handle trailing % by replacing n% with (n/100)
                    const exprWithPercent = safe.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
                    const result = Function('"use strict"; return (' + exprWithPercent + ')')();
                    if(!isFinite(result)) throw new Error('Resultado no finito');
                    return result;
                }catch(e){
                    return 'Error';
                }
            }

            function pressNumber(d){
                if(justEvaluated){
                    // start new number after evaluation unless operator pressed
                    current = d;
                    expression = '';
                    justEvaluated = false;
                } else {
                    if(current === '0') current = d;
                    else current += d;
                }
                updateScreen();
            }

            function pressDecimal(){
                if(justEvaluated){
                    current = '0.';
                    expression = '';
                    justEvaluated = false;
                } else if(!current.includes('.')){
                    current += '.';
                }
                updateScreen();
            }

            function pressOperator(opSym){
                if(justEvaluated){
                    // use last result as start
                    expression = String(current) + ' ' + opSym + ' ';
                    justEvaluated = false;
                } else {
                    if(expression === '' && current === '') return;
                    // add current then operator
                    if(expression === '' && current !== '') {
                        expression = current + ' ' + opSym + ' ';
                        current = '0';
                    } else {
                        // if expression ends with operator, replace it
                        if(/[+\-×÷] $/.test(expression)){
                            expression = expression.slice(0,-3) + opSym + ' ';
                        } else {
                            expression = expression + current + ' ' + opSym + ' ';
                            current = '0';
                        }
                    }
                }
                updateScreen();
            }

            function evaluate(){
                // build full expression
                let full = expression;
                if(!/[+\-×÷] $/.test(full)) {
                    // no trailing operator: just current shown
                    full = current;
                } else {
                    full = full + current;
                }
                const result = computeExpression(full);
                current = (result === 'Error') ? 'Error' : String(result);
                expression = '';
                lastEval = result;
                justEvaluated = true;
                updateScreen();
            }

            function clearEntry(){
                current = '0';
                updateScreen();
            }
            function clearAll(){
                current = '0';
                expression = '';
                justEvaluated = false;
                updateScreen();
            }
            function backspace(){
                if(justEvaluated) {
                    current = '0';
                    justEvaluated = false;
                } else {
                    if(current.length <= 1) current = '0';
                    else current = current.slice(0,-1);
                }
                updateScreen();
            }
            function toggleSign(){
                if(current === '0' || current === 'Error') return;
                if(current.startsWith('-')) current = current.slice(1);
                else current = '-' + current;
                updateScreen();
            }
            function sqrt(){
                const n = parseFloat(current);
                if(n < 0){ current = 'Error'; }
                else current = String(Math.sqrt(n));
                justEvaluated = true;
                updateScreen();
            }
            function reciprocal(){
                const n = parseFloat(current);
                if(n === 0){ current = 'Error'; }
                else current = String(1 / n);
                justEvaluated = true;
                updateScreen();
            }
            function percent(){
                // convert current to percentage of previous expression if an operator exists
                // If no expression, just divide current by 100
                if(expression.trim() === ''){
                    current = String(parseFloat(current) / 100);
                } else {
                    // Example: "200 + " and current = 10 -> treat as 200 * 10 / 100
                    const prevExpr = expression.trim();
                    const match = prevExpr.match(/(.+)\s([+\-×÷])$/);
                    if(match){
                        const left = match[1];
                        const op = match[2];
                        const leftVal = computeExpression(left);
                        const pct = leftVal * parseFloat(current) / 100;
                        current = String(pct);
                    } else {
                        current = String(parseFloat(current) / 100);
                    }
                }
                justEvaluated = false;
                updateScreen();
            }

            // Memory functions: MC MR M+ M-
            function memClear(){ memory = 0; updateScreen(); }
            function memRecall(){ current = String(memory); justEvaluated = true; updateScreen(); }
            function memPlus(){ memory += parseFloat(current) || 0; updateScreen(); }
            function memMinus(){ memory -= parseFloat(current) || 0; updateScreen(); }

            // Button handling
            document.querySelectorAll('button').forEach(btn=>{
                btn.addEventListener('click', ()=>{
                    const num = btn.getAttribute('data-num');
                    const action = btn.getAttribute('data-action');
                    if(num !== null){
                        pressNumber(num);
                        return;
                    }
                    switch(action){
                        case 'decimal': pressDecimal(); break;
                        case 'op': {
                            const sym = btn.textContent.trim();
                            pressOperator(sym);
                            break;
                        }
                        case 'equal': evaluate(); break;
                        case 'clear-entry': clearEntry(); break;
                        case 'clear': clearAll(); break;
                        case 'back': backspace(); break;
                        case 'mc': memClear(); break;
                        case 'mr': memRecall(); break;
                        case 'mplus': memPlus(); break;
                        case 'mminus': memMinus(); break;
                        default: break;
                    }
                });
            });

            // Additional keyboard support
            window.addEventListener('keydown', (e)=>{
                if(/^[0-9]$/.test(e.key)){
                    pressNumber(e.key); e.preventDefault();
                } else if(e.key === '.' || e.key === ','){ pressDecimal(); e.preventDefault(); }
                else if(e.key === 'Enter' || e.key === '='){ evaluate(); e.preventDefault(); }
                else if(e.key === 'Backspace'){ backspace(); e.preventDefault(); }
                else if(e.key === 'Escape'){ clearAll(); e.preventDefault(); }
                else if(e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/'){
                    const map = {'+':'+','-':'−','*':'×','/':'÷'};
                    pressOperator(map[e.key]);
                    e.preventDefault();
                }
            });

            // Expose some hidden functions via double-click on memory indicator
            memEl.addEventListener('dblclick', ()=>{ memory = 0; updateScreen(); });

            // initialize
            updateScreen();
        })();
    