document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. GLOBAL TAB NAVIGATION ROUTER
    // -------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.window-tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Toggle active tabs
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(content => {
                if (content.id === `tab-${tabName}`) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Close shopping cart on tab change
            cartSidebar.classList.remove('open');
        });
    });

    // -------------------------------------------------------------
    // 2. GLOBAL STICKY AUDIO PLAYER
    // -------------------------------------------------------------
    const audioPlayer = document.getElementById('main-audio-element');
    const btnPlayPause = document.getElementById('btn-player-play-pause');
    const playerTrackTitle = document.getElementById('player-track-title');
    const playerTrackArtist = document.getElementById('player-track-artist');
    const playerTrackCover = document.getElementById('player-track-cover');
    
    const playerTimeCurrent = document.getElementById('player-time-current');
    const playerTimeTotal = document.getElementById('player-time-total');
    const playerTimeline = document.getElementById('player-timeline');
    const playerProgressFill = document.getElementById('player-progress-fill');
    const playerVolumeSlider = document.getElementById('player-volume-slider');

    let currentTrackSource = '';

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }

    function playTrack(src, title, artist, cover) {
        if (currentTrackSource !== src) {
            audioPlayer.src = src;
            currentTrackSource = src;
        }
        
        playerTrackTitle.textContent = title;
        playerTrackArtist.textContent = artist;
        if (cover) playerTrackCover.src = cover;

        audioPlayer.play();
        updatePlayerUI(true);
    }

    function togglePlayPause() {
        if (!audioPlayer.src) return;
        if (audioPlayer.paused) {
            audioPlayer.play();
            updatePlayerUI(true);
        } else {
            audioPlayer.pause();
            updatePlayerUI(false);
        }
    }

    function updatePlayerUI(isPlaying) {
        if (isPlaying) {
            btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
        } else {
            btnPlayPause.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
        }
    }

    btnPlayPause.addEventListener('click', togglePlayPause);

    // Audio timeupdate
    audioPlayer.addEventListener('timeupdate', () => {
        const current = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        playerTimeCurrent.textContent = formatTime(current);
        playerTimeTotal.textContent = formatTime(duration);

        if (duration) {
            const percent = (current / duration) * 100;
            playerProgressFill.style.width = `${percent}%`;
        }
    });

    // Seek on timeline click
    playerTimeline.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        const rect = playerTimeline.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });

    // Volume Slider
    playerVolumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
    });

    // Attach play listeners to Releases/Hero play buttons
    document.querySelectorAll('.play-btn-circle, .btn-play-release').forEach(btn => {
        btn.addEventListener('click', () => {
            const src = btn.getAttribute('data-track-src');
            const title = btn.getAttribute('data-track-title');
            const artist = btn.getAttribute('data-track-artist');
            const cover = btn.getAttribute('data-track-cover');
            playTrack(src, title, artist, cover);
        });
    });


    // -------------------------------------------------------------
    // 3. STORE & CART LOGIC
    // -------------------------------------------------------------
    let cart = [];
    const cartSidebar = document.querySelector('.cart-sidebar');
    const btnFloatingCart = document.getElementById('btn-floating-cart');
    const btnCloseCart = document.querySelector('.btn-close-cart');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartTotalValue = document.querySelector('.cart-total-value');
    const floatingCartCount = document.getElementById('floating-cart-count');

    // Cart visibility toggle
    btnFloatingCart.addEventListener('click', () => cartSidebar.classList.add('open'));
    btnCloseCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Filter products
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Add to cart buttons
    document.querySelectorAll('.btn-add-cart, .btn-buy-track').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            
            addToCart(id, name, price);
            cartSidebar.classList.add('open');
        });
    });

    function addToCart(id, name, price) {
        cart.push({ id, name, price });
        updateCartUI();
    }

    function updateCartUI() {
        // Count badge
        floatingCartCount.textContent = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            cartTotalValue.textContent = 'USD 0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <span>Digital Download / Item</span>
                    </div>
                    <div class="cart-item-price">
                        <span>USD ${item.price.toFixed(2)}</span>
                        <button class="btn-remove-item" data-index="${index}">&times;</button>
                    </div>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
        });

        cartTotalValue.textContent = `USD ${total.toFixed(2)}`;

        // Attach delete events
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    // Mock checkout button
    document.querySelector('.btn-checkout').addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('¡Gracias por tu compra! (Este es un flujo de pago simulado)');
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('open');
    });


    // -------------------------------------------------------------
    // 4. DEMO SUBMISSION (Tstack / Hot Creations Style)
    // -------------------------------------------------------------
    const stepPanes = document.querySelectorAll('.tstack-step-pane');
    const stepNavItems = document.querySelectorAll('.step-nav-item');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    const demoForm = document.getElementById('demo-submission-form');
    
    // In-memory array of submitted demos for the admin panel
    let submittedDemos = [
        {
            id: 'demo-mock-1',
            realName: 'Juan Gómez',
            stageName: 'DJ Acid',
            email: 'info@djacid.com',
            dni: '98765432Y',
            address: 'Calle Falsa 123, Buenos Aires, Argentina',
            bio: 'Productor de Tech House de Argentina.',
            trackTitle: 'Vibration Loop',
            genre: 'Tech House',
            streamLink: 'https://soundcloud.com/djacid/vibration-loop-demo',
            samplesUsed: 'no'
        }
    ];

    function validateStep(stepNum) {
        const currentPane = document.getElementById(`demo-step-${stepNum}`);
        const requiredInputs = currentPane.querySelectorAll('[required]');
        let isValid = true;
        
        requiredInputs.forEach(input => {
            if (!input.value || (input.type === 'checkbox' && !input.checked)) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        return isValid;
    }

    btnNextSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = parseInt(btn.parentElement.parentElement.id.replace('demo-step-', ''));
            const targetStep = parseInt(btn.getAttribute('data-target'));
            
            if (validateStep(currentStep)) {
                goToStep(targetStep);
            }
        });
    });

    btnPrevSteps.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetStep = parseInt(btn.getAttribute('data-target'));
            goToStep(targetStep);
        });
    });

    function goToStep(stepNum) {
        stepNavItems.forEach(item => {
            if (parseInt(item.getAttribute('data-step')) === stepNum) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        stepPanes.forEach(pane => {
            if (pane.id === `demo-step-${stepNum}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }

    // Submit demo form
    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newDemo = {
            id: 'demo-' + Date.now(),
            realName: document.getElementById('demo-real-name').value,
            stageName: document.getElementById('demo-artist-name').value,
            email: document.getElementById('demo-email').value,
            dni: document.getElementById('demo-artist-id').value,
            address: document.getElementById('demo-address').value,
            bio: document.getElementById('demo-bio').value,
            trackTitle: document.getElementById('demo-track-title').value,
            genre: document.getElementById('demo-track-genre').value,
            streamLink: document.getElementById('demo-stream-link').value,
            samplesUsed: document.getElementById('demo-samples-used').value
        };

        // Add to global list
        submittedDemos.push(newDemo);
        updateInboxUI();
        
        alert('¡Tu demo ha sido enviada con éxito! El equipo de A&R la revisará pronto.');
        
        // Reset form and go back to step 1
        demoForm.reset();
        goToStep(1);
    });


    // -------------------------------------------------------------
    // 5. ADMIN PANEL & LOGIN
    // -------------------------------------------------------------
    const adminLoginScreen = document.getElementById('admin-login-screen');
    const adminMainWorkspace = document.getElementById('admin-main-workspace');
    const adminPasswordInput = document.getElementById('admin-password');
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const adminLoginError = document.getElementById('admin-login-error');
    const btnAdminLogout = document.getElementById('btn-admin-logout');

    btnAdminLogin.addEventListener('click', () => {
        const pass = adminPasswordInput.value;
        // Password check (simple mock password: bissa)
        if (pass === 'bissa') {
            adminLoginScreen.classList.add('d-none');
            adminMainWorkspace.classList.remove('d-none');
            adminLoginError.style.display = 'none';
            adminPasswordInput.value = '';
            updateInboxUI();
        } else {
            adminLoginError.style.display = 'block';
        }
    });

    btnAdminLogout.addEventListener('click', () => {
        adminMainWorkspace.classList.add('d-none');
        adminLoginScreen.classList.remove('d-none');
    });

    // Admin Inner Sub-tabs
    const adminMenuButtons = document.querySelectorAll('.admin-menu-btn');
    const adminPanes = document.querySelectorAll('.admin-pane-content');

    adminMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const paneName = btn.getAttribute('data-admin-pane');
            if (!paneName) return; // logout button has no pane

            adminMenuButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            adminPanes.forEach(pane => {
                if (pane.id === `pane-${paneName}`) {
                    pane.classList.add('active');
                } else {
                    pane.classList.remove('active');
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 6. ADMIN DEMOS INBOX FLOW
    // -------------------------------------------------------------
    const inboxCount = document.getElementById('inbox-count');
    const inboxList = document.getElementById('inbox-list');

    function updateInboxUI() {
        inboxCount.textContent = submittedDemos.length;
        
        if (submittedDemos.length === 0) {
            inboxList.innerHTML = '<div class="empty-cart-msg">No hay nuevas demos en la bandeja.</div>';
            return;
        }

        inboxList.innerHTML = '';
        submittedDemos.forEach(demo => {
            const cardHTML = `
                <div class="demo-inbox-card" id="${demo.id}">
                    <div class="demo-card-header">
                        <span class="badge badge-purple">DEMO RECIBIDA</span>
                    </div>
                    <div class="demo-card-body">
                        <h3>${demo.trackTitle}</h3>
                        <p class="artist">Por: <strong>${demo.stageName}</strong> | ${demo.realName}</p>
                        <p class="genre">Género: ${demo.genre}</p>
                        <p class="desc">"${demo.bio || 'Sin biografía disponible.'}"</p>
                        <div class="demo-player-box">
                            <button class="btn btn-secondary btn-play-demo" data-src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" data-title="${demo.trackTitle}" data-artist="${demo.stageName}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Escuchar Demo
                            </button>
                            <span class="demo-link-label">Enlace Original: <a href="${demo.streamLink}" target="_blank">SoundCloud privado / Dropbox</a></span>
                        </div>
                    </div>
                    <div class="demo-card-actions">
                        <button class="btn btn-danger btn-reject-demo" data-id="${demo.id}">Rechazar</button>
                        <button class="btn btn-success btn-approve-demo" 
                            data-id="${demo.id}"
                            data-realname="${demo.realName}"
                            data-stagename="${demo.stageName}"
                            data-dni="${demo.dni}"
                            data-address="${demo.address}"
                            data-track="${demo.trackTitle}"
                            data-genre="${demo.genre}">
                            Aprobar y Crear Contrato
                        </button>
                    </div>
                </div>
            `;
            inboxList.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Hook up listen buttons
        document.querySelectorAll('.btn-play-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const title = btn.getAttribute('data-title');
                const artist = btn.getAttribute('data-artist');
                playTrack(src, title, artist, 'logo.png');
            });
        });

        // Hook up reject buttons
        document.querySelectorAll('.btn-reject-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                submittedDemos = submittedDemos.filter(d => d.id !== id);
                updateInboxUI();
            });
        });

        // Hook up approve buttons (Transitions to Contract generator and autofills fields!)
        document.querySelectorAll('.btn-approve-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const realName = btn.getAttribute('data-realname');
                const stageName = btn.getAttribute('data-stagename');
                const dni = btn.getAttribute('data-dni');
                const address = btn.getAttribute('data-address');
                const track = btn.getAttribute('data-track');
                const genre = btn.getAttribute('data-genre');

                // 1. Auto-fill contract form fields
                inputs['artist-real-name'].value = realName;
                inputs['artist-stage-name'].value = stageName;
                inputs['artist-id'].value = dni;
                inputs['artist-address'].value = address;
                inputs['track-title'].value = track;
                inputs['track-genre'].value = genre;
                inputs['track-version'].value = 'Original Mix';

                // Update text page bindings
                updateBinds();

                // 2. Remove demo from inbox
                submittedDemos = submittedDemos.filter(d => d.id !== id);
                updateInboxUI();

                // 3. Switch admin sub-tab view to Creador de Contratos
                document.querySelectorAll('.admin-menu-btn').forEach(b => {
                    if (b.getAttribute('data-admin-pane') === 'contracts') {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });

                adminPanes.forEach(pane => {
                    if (pane.id === 'pane-contracts') {
                        pane.classList.add('active');
                    } else {
                        pane.classList.remove('active');
                    }
                });

                alert(`¡Demo aprobada! La información del artista se ha cargado automáticamente en el Creador de Contratos.`);
            });
        });
    }

    // -------------------------------------------------------------
    // 7. CONTRACT GENERATOR (Inputs & Drawing Signature)
    // -------------------------------------------------------------
    const inputs = {
        'artist-real-name': document.getElementById('artist-real-name'),
        'artist-stage-name': document.getElementById('artist-stage-name'),
        'artist-id': document.getElementById('artist-id'),
        'artist-address': document.getElementById('artist-address'),
        'track-title': document.getElementById('track-title'),
        'track-version': document.getElementById('track-version'),
        'track-genre': document.getElementById('track-genre'),
        'contract-duration': document.getElementById('contract-duration'),
        'royalty-percentage': document.getElementById('royalty-percentage'),
        'contract-date': document.getElementById('contract-date')
    };

    // Set default date to today
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    inputs['contract-date'].value = `${yyyy}-${mm}-${dd}`;

    // Update binds
    function updateBinds() {
        Object.keys(inputs).forEach(key => {
            const input = inputs[key];
            const value = input.value;
            const binds = document.querySelectorAll(`[data-bind="${key}"]`);
            
            binds.forEach(bind => {
                if (key === 'contract-date') {
                    if (value) {
                        const [year, month, day] = value.split('-');
                        bind.textContent = `${day} / ${month} / ${year}`;
                    } else {
                        bind.textContent = '____ / ____ / 20___';
                    }
                } else {
                    bind.textContent = value || `[${input.placeholder || 'vacio'}]`;
                }
            });
        });
    }

    // Attach listeners
    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', updateBinds);
    });

    // Canvas Signature Pad Logic
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Signature styling (dark blue ink)
    ctx.strokeStyle = '#0033aa';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2.5;

    function getCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.touches && e.touches.length > 0) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault();
        
        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
        
        lastX = coords.x;
        lastY = coords.y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    // Touch
    canvas.addEventListener('touchstart', (e) => {
        startDrawing(e);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    // Clear Signature
    const btnClear = document.getElementById('btn-clear-sig');
    btnClear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save as PDF Action using html2pdf.js
    const btnPrint = document.getElementById('btn-print');
    btnPrint.addEventListener('click', () => {
        const artistStageName = inputs['artist-stage-name'].value || 'Artista';
        const trackTitle = inputs['track-title'].value || 'Track';
        const filename = `Contrato_Lanzamiento_Bissa_${artistStageName.replace(/\s+/g, '_')}_${trackTitle.replace(/\s+/g, '_')}.pdf`;

        // Temporarily hide highlights on page for cleaner PDF export
        const highlights = document.querySelectorAll('.field-bind');
        highlights.forEach(el => el.style.color = '#000000');

        const pages = document.querySelectorAll('.document-page');
        const element = document.createElement('div');
        
        pages.forEach(page => {
            const clone = page.cloneNode(true);
            
            // Remove style scales for clean PDF render
            clone.style.transform = 'none';
            clone.style.marginBottom = '0';
            
            const origCanvas = page.querySelector('#signature-pad');
            if (origCanvas) {
                const cloneCanvas = clone.querySelector('#signature-pad');
                const cloneCtx = cloneCanvas.getContext('2d');
                cloneCtx.drawImage(origCanvas, 0, 0);
            }
            element.appendChild(clone);
        });

        const opt = {
            margin:       [0, 0, 0, 0],
            filename:     filename,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                letterRendering: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    });

    // Initial binding
    updateBinds();
});
