var Config = {

    hockey: {
        positions: {
            goalkeeper: {
                name: 'Вратарь',
                visible: ['goa', 'pas', 'tec'],
                skills: {
                    goa: 100,
                    pas: 50,
                    tec: 50
                }
            },
            deffender: {
                name: 'Защита',
                visible: ['def', 'sho', 'pas', 'tec', 'agr'],
                skills: {
                    def: 100,
                    pas: 50,
                    tec: 47,
                    agr: 50
                }
            },
            winger: {
                name: 'Крайний напад',
                visible: ['off', 'sho', 'tec', 'agr'],
                skills: {
                    off: 100,
                    sho: 70,
                    tec: 50,
                    agr: 50
                }
            },
            center: {
                name: 'Центр напад',
                visible: ['off', 'sho', 'pas', 'tec'],
                skills: {
                    off: 100,
                    sho: 50,
                    pas: 50,
                    tec: 50
                }
            }
        }
    },

    soccer: {

    },

    handball: {

    }

};