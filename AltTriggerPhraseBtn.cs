using SwarmUI.Core;
using SwarmUI.Utils;
using SwarmUI.Text2Image;
using SwarmUI.Builtin_ComfyUIBackend;
using Newtonsoft.Json.Linq;

namespace Blomblo.Extensions.AltTriggerPhraseBtn;

public class AltTriggerPhraseBtn : Extension
{
    public override void OnInit()
    {
        Logs.Init("Alternate Trigger Phrase Button Extension initializing...");

        ScriptFiles.Add("Assets/altTriggerPhraseBtn.js");
        StyleSheetFiles.Add("Assets/altTriggerPhraseBtn.css");

        Logs.Init("Alternate Trigger Phrase Button Extension initialized successfully");
    }
}
