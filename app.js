document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // DYNAMIC DATA ARRAYS (Releases & Shop Items)
    // -------------------------------------------------------------
    let releases = [
        {
            id: 'rel-1',
            title: 'Sinfonía del Espacio',
            artist: 'DJ JUAN',
            version: 'Original Mix',
            genre: 'Tech House',
            date: '27-05-2026',
            price: 1.99,
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
        },
        {
            id: 'rel-2',
            title: 'Acid Moon',
            artist: 'Nacho Serra',
            version: 'Original Mix',
            genre: 'Melodic Techno',
            date: '14-05-2026',
            price: 1.99,
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
        },
        {
            id: 'rel-3',
            title: 'Bassline Groover',
            artist: 'Nico Servidio',
            version: 'Radio Edit',
            genre: 'Tech House',
            date: '28-04-2026',
            price: 1.99,
            audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
        }
    ];

    let shopProducts = [
        {
            id: 'merch-tee',
            name: 'Camiseta Bissa Cyber Tee',
            desc: 'Camiseta premium 100% algodón con estampado flúor verde manzana y violeta.',
            category: 'merch',
            price: 29.99
        },
        {
            id: 'merch-cap',
            name: 'Gorra Bissa Dad Cap',
            desc: 'Gorra clásica con logotipo BiSSa bordado en alta definición flúor.',
            category: 'merch',
            price: 19.99
        },
        {
            id: 'samples-th1',
            name: 'Bissa Tech House Sample Pack Vol.1',
            desc: 'Más de 500 loops de bajo, baterías crujientes y presets listos para tus pistas.',
            category: 'samples',
            price: 34.99
        },
        {
            id: 'samples-acid',
            name: 'Minimal & Acid Pack',
            desc: 'Samples analógicos reales grabados con sintetizadores y cajas de ritmo vintage.',
            category: 'samples',
            price: 24.99
        },
        {
            id: 'music-sinfonia',
            name: 'Sinfonía del Espacio (WAV / MP3)',
            desc: 'Licencia digital directa del track en alta fidelidad de 24 bits.',
            category: 'music',
            price: 1.99
        }
    ];

    // -------------------------------------------------------------
    // RENDER FUNCTIONS (UI Updates)
    // -------------------------------------------------------------
    const bpTracksContainer = document.getElementById('bp-tracks-container');
    const shopProductsContainer = document.getElementById('shop-products-container');
    const adminReleasesList = document.getElementById('admin-releases-list');
    const adminProductsList = document.getElementById('admin-products-list');

    function renderReleases() {
        bpTracksContainer.innerHTML = '';
        releases.forEach(track => {
            const html = `
                <div class="bp-track-item">
                    <div class="col-play">
                        <button class="play-btn-circle" data-track-src="${track.audioSrc}" data-track-title="${track.title}" data-track-artist="${track.artist}" data-track-cover="logo.png">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                        </button>
                    </div>
                    <div class="col-title">
                        <img src="logo.png" alt="Cover" class="track-mini-cover">
                        <div class="title-details">
                            <span class="track-name">${track.title}</span>
                            <span class="version-name">${track.version}</span>
                        </div>
                    </div>
                    <div class="col-artist">${track.artist}</div>
                    <div class="col-genre">
                        <span class="badge ${track.genre.toLowerCase().includes('tech') ? 'badge-green' : 'badge-purple'}">${track.genre}</span>
                    </div>
                    <div class="col-date">${track.date}</div>
                    <div class="col-price">USD ${track.price.toFixed(2)}</div>
                    <div class="col-cart">
                        <button class="btn-buy-track" data-id="${track.id}" data-name="${track.title} (${track.artist})" data-price="${track.price}" data-type="música">
                            COMPRAR
                        </button>
                    </div>
                </div>
            `;
            bpTracksContainer.insertAdjacentHTML('beforeend', html);
        });

        // Rebind play events for releases list
        bpTracksContainer.querySelectorAll('.play-btn-circle').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-track-src');
                const title = btn.getAttribute('data-track-title');
                const artist = btn.getAttribute('data-track-artist');
                const cover = btn.getAttribute('data-track-cover');
                playTrack(src, title, artist, cover);
            });
        });

        // Rebind buy events for releases list
        bpTracksContainer.querySelectorAll('.btn-buy-track').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                addToCart(id, name, price);
                cartSidebar.classList.add('open');
            });
        });

        // Update Hottest Release (hero banner) to match first track
        if (releases.length > 0) {
            document.getElementById('hero-track-title').textContent = releases[0].title;
            document.getElementById('hero-track-artist').textContent = releases[0].artist;
            const heroBtn = document.getElementById('hero-btn-play');
            heroBtn.setAttribute('data-track-src', releases[0].audioSrc);
            heroBtn.setAttribute('data-track-title', releases[0].title);
            heroBtn.setAttribute('data-track-artist', releases[0].artist);
        }
    }

    function renderShopProducts() {
        shopProductsContainer.innerHTML = '';
        shopProducts.forEach(prod => {
            const html = `
                <div class="product-card" data-category="${prod.category}">
                    <div class="product-image-container">
                        <div class="product-badge ${prod.category === 'samples' ? 'accent-purple' : ''}">${prod.category === 'merch' ? 'merch' : (prod.category === 'samples' ? 'pro audio' : 'música')}</div>
                        <div class="product-placeholder ${prod.category === 'samples' ? 'samples-placeholder' : (prod.category === 'music' ? 'music-placeholder' : 'merch-placeholder')}">
                            <span>${prod.name.toUpperCase().substring(0, 18)}</span>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${prod.name}</h3>
                        <p class="product-desc">${prod.desc}</p>
                        <div class="product-price-row">
                            <span class="price">USD ${prod.price.toFixed(2)}</span>
                            <button class="btn btn-primary btn-add-cart" data-id="${prod.id}" data-name="${prod.name}" data-price="${prod.price}" data-type="${prod.category}">
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            shopProductsContainer.insertAdjacentHTML('beforeend', html);
        });

        // Rebind Add to Cart buttons
        shopProductsContainer.querySelectorAll('.btn-add-cart').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const name = btn.getAttribute('data-name');
                const price = parseFloat(btn.getAttribute('data-price'));
                addToCart(id, name, price);
                cartSidebar.classList.add('open');
            });
        });
    }

    function renderAdminReleasesList() {
        adminReleasesList.innerHTML = '';
        releases.forEach(track => {
            const html = `
                <div class="admin-item-row">
                    <div class="admin-item-info">
                        <h4>${track.title} (${track.version})</h4>
                        <p>${track.artist} | ${track.genre} | USD ${track.price.toFixed(2)}</p>
                    </div>
                    <button class="btn-delete-item btn-delete-release" data-id="${track.id}">Eliminar</button>
                </div>
            `;
            adminReleasesList.insertAdjacentHTML('beforeend', html);
        });

        // Bind delete action
        adminReleasesList.querySelectorAll('.btn-delete-release').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                releases = releases.filter(r => r.id !== id);
                renderReleases();
                renderAdminReleasesList();
            });
        });
    }

    function renderAdminProductsList() {
        adminProductsList.innerHTML = '';
        shopProducts.forEach(prod => {
            const html = `
                <div class="admin-item-row">
                    <div class="admin-item-info">
                        <h4>${prod.name}</h4>
                        <p>Categoría: ${prod.category} | USD ${prod.price.toFixed(2)}</p>
                    </div>
                    <button class="btn-delete-item btn-delete-product" data-id="${prod.id}">Eliminar</button>
                </div>
            `;
            adminProductsList.insertAdjacentHTML('beforeend', html);
        });

        // Bind delete action
        adminProductsList.querySelectorAll('.btn-delete-product').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                shopProducts = shopProducts.filter(p => p.id !== id);
                renderShopProducts();
                renderAdminProductsList();
            });
        });
    }

    // -------------------------------------------------------------
    // TAB ROUTER & HIDDEN ADMIN ACCESS
    // -------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.nav-tab-btn');
    const tabContents = document.querySelectorAll('.window-tab-content');
    const linkAdminAccess = document.getElementById('link-admin-access');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    linkAdminAccess.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('admin');
    });

    function switchTab(tabName) {
        tabButtons.forEach(b => {
            if (b.getAttribute('data-tab') === tabName) {
                b.classList.add('active');
            } else {
                b.classList.remove('active');
            }
        });
        
        tabContents.forEach(content => {
            if (content.id === `tab-${tabName}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        cartSidebar.classList.remove('open');
    }

    // -------------------------------------------------------------
    // GLOBAL STICKY AUDIO PLAYER
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

    playerTimeline.addEventListener('click', (e) => {
        if (!audioPlayer.duration) return;
        const rect = playerTimeline.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });

    playerVolumeSlider.addEventListener('input', (e) => {
        audioPlayer.volume = e.target.value;
    });

    // Hero banner play action
    document.getElementById('hero-btn-play').addEventListener('click', function() {
        const src = this.getAttribute('data-track-src');
        const title = this.getAttribute('data-track-title');
        const artist = this.getAttribute('data-track-artist');
        playTrack(src, title, artist, 'logo.png');
    });

    // -------------------------------------------------------------
    // SHOP CART STATE & VISUAL CONTROLLER
    // -------------------------------------------------------------
    let cart = [];
    const cartSidebar = document.querySelector('.cart-sidebar');
    const btnFloatingCart = document.getElementById('btn-floating-cart');
    const btnCloseCart = document.querySelector('.btn-close-cart');
    const cartItemsContainer = document.querySelector('.cart-items-container');
    const cartTotalValue = document.querySelector('.cart-total-value');
    const floatingCartCount = document.getElementById('floating-cart-count');

    btnFloatingCart.addEventListener('click', () => cartSidebar.classList.add('open'));
    btnCloseCart.addEventListener('click', () => cartSidebar.classList.remove('open'));

    // Filter products
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            const cards = shopProductsContainer.querySelectorAll('.product-card');
            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    function addToCart(id, name, price) {
        cart.push({ id, name, price });
        updateCartUI();
    }

    function updateCartUI() {
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
                        <span>Digital Download</span>
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

        // Remove item binding
        document.querySelectorAll('.btn-remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.getAttribute('data-index'));
                cart.splice(idx, 1);
                updateCartUI();
            });
        });
    }

    document.querySelector('.btn-checkout').addEventListener('click', () => {
        if (cart.length === 0) return;
        alert('¡Gracias por tu compra! (Flujo de checkout simulado)');
        cart = [];
        updateCartUI();
        cartSidebar.classList.remove('open');
    });

    // -------------------------------------------------------------
    // WIZARD DEMO DROP (Tstack Form)
    // -------------------------------------------------------------
    const stepPanes = document.querySelectorAll('.tstack-step-pane');
    const stepNavItems = document.querySelectorAll('.step-nav-item');
    const btnNextSteps = document.querySelectorAll('.btn-next-step');
    const btnPrevSteps = document.querySelectorAll('.btn-prev-step');
    const demoForm = document.getElementById('demo-submission-form');
    
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

        submittedDemos.push(newDemo);
        updateInboxUI();
        
        alert('¡Tu demo ha sido enviada con éxito! El equipo de A&R la revisará pronto.');
        demoForm.reset();
        goToStep(1);
    });

    // -------------------------------------------------------------
    // ADMIN SYSTEM (Authentication & Menu Routing)
    // -------------------------------------------------------------
    const adminLoginScreen = document.getElementById('admin-login-screen');
    const adminMainWorkspace = document.getElementById('admin-main-workspace');
    const adminPasswordInput = document.getElementById('admin-password');
    const btnAdminLogin = document.getElementById('btn-admin-login');
    const adminLoginError = document.getElementById('admin-login-error');
    const btnAdminLogout = document.getElementById('btn-admin-logout');

    btnAdminLogin.addEventListener('click', () => {
        const pass = adminPasswordInput.value;
        if (pass === 'bissa') {
            adminLoginScreen.classList.add('d-none');
            adminMainWorkspace.classList.remove('d-none');
            adminLoginError.style.display = 'none';
            adminPasswordInput.value = '';
            
            // Render all admin list elements
            updateInboxUI();
            renderAdminReleasesList();
            renderAdminProductsList();
        } else {
            adminLoginError.style.display = 'block';
        }
    });

    btnAdminLogout.addEventListener('click', () => {
        adminMainWorkspace.classList.add('d-none');
        adminLoginScreen.classList.remove('d-none');
    });

    // Admin sub-pane navigation
    const adminMenuButtons = document.querySelectorAll('.admin-menu-btn');
    const adminPanes = document.querySelectorAll('.admin-pane-content');

    adminMenuButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const paneName = btn.getAttribute('data-admin-pane');
            if (!paneName) return;

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
    // ADMIN DEMO INBOX CONTROLLER
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
                            <span class="demo-link-label">Enlace Original: <a href="${demo.streamLink}" target="_blank">SoundCloud privado</a></span>
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

        // Bind play demo
        inboxList.querySelectorAll('.btn-play-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const src = btn.getAttribute('data-src');
                const title = btn.getAttribute('data-title');
                const artist = btn.getAttribute('data-artist');
                playTrack(src, title, artist, 'logo.png');
            });
        });

        // Bind reject demo
        inboxList.querySelectorAll('.btn-reject-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                submittedDemos = submittedDemos.filter(d => d.id !== id);
                updateInboxUI();
            });
        });

        // Bind approve demo (Auto-populates contract and jumps to it!)
        inboxList.querySelectorAll('.btn-approve-demo').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const realName = btn.getAttribute('data-realname');
                const stageName = btn.getAttribute('data-stagename');
                const dni = btn.getAttribute('data-dni');
                const address = btn.getAttribute('data-address');
                const track = btn.getAttribute('data-track');
                const genre = btn.getAttribute('data-genre');

                // Fill contract form
                inputs['artist-real-name'].value = realName;
                inputs['artist-stage-name'].value = stageName;
                inputs['artist-id'].value = dni;
                inputs['artist-address'].value = address;
                inputs['track-title'].value = track;
                inputs['track-genre'].value = genre;
                inputs['track-version'].value = 'Original Mix';

                // Sync bounds
                updateBinds();

                // Remove from list
                submittedDemos = submittedDemos.filter(d => d.id !== id);
                updateInboxUI();

                // Navigate to contracts pane inside workspace
                adminMenuButtons.forEach(b => {
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

                alert(`¡Demo aprobada! La información se ha cargado automáticamente en el Creador de Contratos.`);
            });
        });
    }

    // -------------------------------------------------------------
    // EDIT RELEASES FORM SUBMIT
    // -------------------------------------------------------------
    const formAddRelease = document.getElementById('form-add-release');
    formAddRelease.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTrack = {
            id: 'rel-' + Date.now(),
            title: document.getElementById('rel-title').value,
            artist: document.getElementById('rel-artist').value,
            version: document.getElementById('rel-version').value,
            genre: document.getElementById('rel-genre').value,
            date: document.getElementById('rel-date').value,
            price: parseFloat(document.getElementById('rel-price').value),
            audioSrc: document.getElementById('rel-audio').value
        };

        releases.push(newTrack);
        
        // Re-render
        renderReleases();
        renderAdminReleasesList();
        
        // Reset form
        formAddRelease.reset();
        document.getElementById('rel-version').value = 'Original Mix';
        document.getElementById('rel-price').value = '1.99';
        document.getElementById('rel-audio').value = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3';
        
        alert('¡Track agregado exitosamente al catálogo de Releases!');
    });

    // -------------------------------------------------------------
    // EDIT STORE FORM SUBMIT
    // -------------------------------------------------------------
    const formAddProduct = document.getElementById('form-add-product');
    formAddProduct.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newProd = {
            id: 'prod-' + Date.now(),
            name: document.getElementById('prod-name').value,
            desc: document.getElementById('prod-desc').value,
            category: document.getElementById('prod-category').value,
            price: parseFloat(document.getElementById('prod-price').value)
        };

        shopProducts.push(newProd);

        // Re-render
        renderShopProducts();
        renderAdminProductsList();

        // Reset form
        formAddProduct.reset();

        alert('¡Producto agregado exitosamente a la tienda!');
    });


    // -------------------------------------------------------------
    // CONTRACT GENERATOR SYSTEM
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

    Object.keys(inputs).forEach(key => {
        inputs[key].addEventListener('input', updateBinds);
    });

    // Canvas Signature pad
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

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

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);

    canvas.addEventListener('touchstart', (e) => {
        startDrawing(e);
        e.preventDefault();
    }, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    const btnClear = document.getElementById('btn-clear-sig');
    btnClear.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    const btnPrint = document.getElementById('btn-print');
    btnPrint.addEventListener('click', () => {
        const artistStageName = inputs['artist-stage-name'].value || 'Artista';
        const trackTitle = inputs['track-title'].value || 'Track';
        const filename = `Contrato_Lanzamiento_Bissa_${artistStageName.replace(/\s+/g, '_')}_${trackTitle.replace(/\s+/g, '_')}.pdf`;

        const highlights = document.querySelectorAll('.field-bind');
        highlights.forEach(el => el.style.color = '#000000');

        const pages = document.querySelectorAll('.document-page');
        const element = document.createElement('div');
        
        pages.forEach(page => {
            const clone = page.cloneNode(true);
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

    // -------------------------------------------------------------
    // INITIALIZATION RENDER CALLS
    // -------------------------------------------------------------
    renderReleases();
    renderShopProducts();
    updateBinds();
});
