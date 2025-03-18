<script setup>

</script>

<template>
    <div class="profile-container debug">
        <span class="section-title">Allgemeine Informationen</span>
        <hr>
        <div class="profile-grid">
            <div class="profile-grid-box">Name</div>
            <div class="profile-grid-box">Bla</div>
            <div class="profile-grid-box">E-Mail Adresse</div>
            <div class="profile-grid-box">Bla</div>
        </div>
        <span class="section-title">Passwort ändern</span>
        <hr>
        <div class="profile-grid">
            <div class="profile-grid-box">Passwort</div>
            <div class="profile-grid-box">Bla</div>
            <div class="profile-grid-box">Passwort wiederholen</div>
            <div class="profile-grid-box">Bla</div>
        </div>
        <span class="section-title">Aktivitäten</span>
        <hr>
        <span class="section-title">Konto löschen</span>
        <hr>
    </div>
</template>

<style>
    .profile-container {
        
    }

    .profile-grid {
        display: grid;
        grid-template-columns: 1fr 3fr;
    }

    .profile-grid-box {
        padding: 10px 0;
    }

    .section-title {
        display: block;
        padding: 10px 0;
        font-size: 20px;
    }
</style>