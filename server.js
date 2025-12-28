const express = require("express");
const bodyParser = require("body-parser");
const { client, EmbedBuilder, readyPromise } = require("./bot");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <form method="POST" action="/announce">
      <input type="text" name="channel" placeholder="Channel ID" required/><br>
      <textarea name="message" placeholder="Announcement" required></textarea><br>
      <input type="text" name="image" placeholder="Image URL (optional)"/><br>
      <input type="color" name="color" value="#800080"/><br>
      <button type="button" onclick="preview()">Preview</button>
      <button type="submit">Send</button>
    </form>
    <div id="preview" style="border:1px solid #ccc; padding:10px; margin-top:10px;"></div>
    <script>
      function preview() {
        const f=document.forms[0], m=f.message.value, i=f.image.value, c=f.color.value;
        let html='<div style="border-left:10px solid '+c+'; padding:5px;"><strong>📢 Announcement</strong><br>'+m;
        if(i) html+='<br><img src="'+i+'" style="max-width:100%;"/>'; html+='</div>';
        document.getElementById('preview').innerHTML=html;
      }
    </script>
  `);
});

app.post("/announce", async (req,res)=>{
  const {channel,message,image,color}=req.body;
  try{
    await readyPromise;
    const ch=await client.channels.fetch(channel);
    if(!ch) return res.send("❌ Invalid channel ID");
    const embed=new EmbedBuilder().setTitle("📢 Announcement").setDescription(message).setColor(color||"#800080").setTimestamp();
    if(image && image.trim()!=="") embed.setImage(image);
    await ch.send({embeds:[embed]});
    res.send("✅ Announcement sent! <a href='/'>Back</a>");
  }catch(e){console.log(e);res.send("❌ Failed to send");}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>console.log("🌐 Dashboard running"));
