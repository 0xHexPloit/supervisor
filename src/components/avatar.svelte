<script lang="ts">
    export let name: string;
    export let size = 64;
  
    $: initials = name.slice(0, 2).toUpperCase();
    
    $: bgColor = generateColorFromString(name);
  
    function generateColorFromString(str: string) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = Math.abs(hash % 360);
      return `hsl(${hue}, 65%, 55%)`;
    }
</script>
  
<div 
    class="avatar"
    style:background-color={bgColor}
    style:width="{size}px"
    style:height="{size}px"
    style:font-size="{size/2}px"
>
    {initials}
</div>
  
<style>
    .avatar {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }
</style>