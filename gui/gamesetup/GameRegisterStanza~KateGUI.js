// MODS FILTER CODE
if (!GameRegisterStanza.prototype.KateGUI_filterModsList)
{
    GameRegisterStanza.prototype.KateGUI_filterModsList = []
    GameRegisterStanza.prototype.KateGUI_filterMods = function ()
    {
        if (!g_IsController || !Engine.HasXmppClient())
            return;

        const filter = mod => this.KateGUI_filterModsList.every(f => f(...mod))
        this.mods = JSON.stringify(Engine.GetEngineInfo().mods.filter(filter))
    }

    KateGUI_patchApplyN(GameRegisterStanza.prototype, "sendImmediately", function (target, that, args)
    {
        that.KateGUI_filterMods()
        return target.apply(that, args)
    })
}

/**
 * MOD FILTER
 * @returns False: removes mod from mods list
 */
GameRegisterStanza.prototype.KateGUI_filterModsList.push((name, version) =>
{
    if (name != "KateGUI")
        return true

    return g_KateGUI_maps.has(g_GameAttributes.map)
})

// STANZA REREGISTER CODE
KateGUI_patchApplyN(GameRegisterStanza.prototype, "sendImmediately", function (target, that, args)
{
    let result = target.apply(that, args);

    if (g_IsController && that.lastStanza != undefined)
        that.KateGUI_stanza.setValue("gamesetup", that.lastStanza);

    return result;
})

GameRegisterStanza.prototype.KateGUI_stanza = new ConfigJSON("stanza", false);
GameRegisterStanza.prototype.KateGUI_stanza.removeAllValues();
