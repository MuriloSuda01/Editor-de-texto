function formatText(command) {
    document.execCommand(command, false, null);
}

function alignText(alignment) {
    document.execCommand("justify" + alignment, false, null);
}

function changeFont(font) {
    document.execCommand("fontName", false, font);
}

function changeFontSize(size) {
    document.execCommand("styleWithCSS", false, true);
    document.execCommand("fontSize", false, size);
}

function changeColor(color) {
    document.execCommand("foreColor", false, color);
}

document.querySelectorAll("button, select, input").forEach(element => {
    element.addEventListener("click", () => document.getElementById("editor").focus());
});

function saveDocument() {
    const name = document.getElementById("doc-name").value.trim() || "Documento_Sem_Nome";
    const content = document.getElementById("editor").innerHTML;
    localStorage.setItem(name, content);
    loadDocuments();
}

function loadDocuments() {
    const docList = document.getElementById("doc-list");
    docList.innerHTML = "";
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const li = document.createElement("li");
        const input = document.createElement("input");
        input.type = "text";
        input.value = key;
        input.onchange = (e) => renameDocument(key, e.target.value);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Excluir";
        deleteBtn.onclick = () => deleteDocument(key);
        
        li.appendChild(input);
        li.appendChild(deleteBtn);
        li.onclick = () => loadDocument(key);
        docList.appendChild(li);
    }
}

function renameDocument(oldName, newName) {
    if (!newName.trim() || oldName === newName) return;
    const content = localStorage.getItem(oldName);
    localStorage.setItem(newName, content);
    localStorage.removeItem(oldName);
    loadDocuments();
}

function deleteDocument(name) {
    localStorage.removeItem(name);
    loadDocuments();
}

function loadDocument(name) {
    document.getElementById("doc-name").value = name;
    document.getElementById("editor").innerHTML = localStorage.getItem(name);
}

function downloadDocument(format) {
    const name = document.getElementById("doc-name").value || "Documento_Sem_Nome";
    let content = document.getElementById("editor").innerHTML;
    let blob;
    
    if (format === "txt") {
        content = content.replace(/<[^>]*>/g, "");
        blob = new Blob([content], { type: "text/plain" });
    } else {
        blob = new Blob([content], { type: "text/html" });
    }
    
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name + "." + format;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

document.addEventListener("DOMContentLoaded", loadDocuments);
